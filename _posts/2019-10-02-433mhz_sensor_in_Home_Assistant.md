---
title: 433mhz sensor in Home Assistant
date: 2019-10-02 00:00
category: Home-Automation
tags: Linux Home-Assistant RTL_SDR Radio
authors: Acid Density
summary: Getting a 433mhz weather station working in Home Assistant
published: true
layout: post
---


# Introduction #
Recently I wanted to explore the possability of getting my Acurite 3n1 weather station to work with Home Assistant.
Searching around online I found that it's possible to read from these sensors with an inexpensive dongle using the 
RTL2832U chip and some software called RTL_433 which makes use of the RTL_SDR project.

# Requirements #
To do this you will need:

- A RTL_SDR compatible device. I'm using this [DVB-T Receiver](https://www.amazon.com/dp/B07MP5DHXK/)
- A computer with an available USB port running Linux, Windows, or Mac OS. I'm running Linux Mint 18.1, it's worth noting it is possible to run this on a Raspberry Pi.
- Some kind of sensor that transmits on 433mhz. In this case I'm using an [Acurite 3n1 Weatherstation](https://www.amazon.com/dp/B002YVTTQ4/)

# Setup #

## Installing RTL_433 ##
Since I'm using Linux Mint, the rtl_433 package wasn't available in the repos yet. So I opted to build the package myself.
To do this, I followed the guide found on their [build page](https://github.com/merbanan/rtl_433/blob/master/docs/BUILDING.md)

First you start out by making sure you have all the build dependencies.

```bash
sudo apt-get install libtool \
libusb-1.0-0-dev \
librtlsdr-dev \
rtl-sdr \
build-essential \
autoconf \
cmake \
pkg-config
```

Next you want to clone the git repo.

```bash
git clone https://github.com/merbanan/rtl_433
```

Now you will actually do the building of the package. 
Note, you only need to have root permissions for the last step (make install), due to it copying the executable to a system directory.

```bash
cd rtl_433/
mkdir build
cd build
cmake ..
make
sudo make install
```

## Running RTL_433 ##

At this point you are ready to run rtl_433. Ensure you have your dongle connected to the system and then run the following.

```bash
sudo rtl_433 -F "mqtt://<mqtt-broker-IP>,retain=0,devices=rtl_433[/model][/id]"
```

You will want to customize this command by changing the mqtt broker IP and adjusting "devices" to match your mqtt topic.
In this case the topics will be structured like this: 

```text
rtl_433/Acurite_3n1_sensor/temperature_F  
rtl_433/Acurite_3n1_sensor/humidity  
rtl_433/Acurite_3n1_sensor/battery  
rtl_433/Acurite_3n1_sensor/channel  
rtl_433/Acurite_3n1_sensor/wind_speed_mph  
rtl_433/Acurite_3n1_sensor/sequence_num  
rtl_433/Acurite_3n1_sensor/sensor_id  
rtl_433/Acurite_3n1_sensor/messate_type  
rtl_433/Acurite_3n1_sensor/time  
```

These are just the topics that my sensor puts out, yours may vary. It's important to note that it is likely your "sensor_id" number will change when you change batteries in your sensor.
Make sure you prepare for that when setting up automations or template in Home Assistant.

# Home Assistant #
You should now have data streaming into Home Assistant. You can verify this by loading your Home Assistant image in a browser and navigating to Developer Tools -> MQTT and under "Listen to a topic" enter 'rtl_433/#', then click "Start Listening".
Naturally, you may need to edit the topic to match your topic settings. As the data flows in, you will see the messages start populating on Home Assistant.

## Configuring the sensor in HASS ##
Now we are going to setup the sensor so that Home Assistant knows a little about the information that's coming in over mqtt. To do this you will want to edit the yaml file where you store your sensor configurations, for me that is in sensor.yaml
Here is a snippet of my configuration for this sensor.

```text
  ## Temperature ##
  - platform: mqtt
    name: "rtl_433_acurite_3n1_temperature"
    state_topic: "rtl_433/Acurite_3n1_sensor/temperature_F"
    unit_of_measurement: "°F"

  ## Humidity ##
  - platform: mqtt
    name: "rtl_433_accurite_3n1_humidity"
    state_topic: "rtl_433/Acurite_3n1_sensor/humidity"
    unit_of_measurement: "%"

  ## Battery ##
  - platform: mqtt
    name: "rtl_433_accurite_3n1_battery"
    state_topic: "rtl_433/Acurite_3n1_sensor/battery"

  ## Wind Speed ##
  - platform: mqtt
    name: "rtl_433_accurite_3n1_windspeed"
    state_topic: "rtl_433/Acurite_3n1_sensor/wind_speed_mph"
    unit_of_measurement: "mph"
```

I needed to enter the unit_of_measurement descriptor so Home Assistant knows that kind of unit each reading was, which allows me to have a graph of the information on my lovelace dashboard.
When entering your sensor details you will want to make sure the state_topic matches what you have configured for your sensor. The name you give here will be the name of the sensor in Home Assistant.

# Conclusion #
You should now have your 433mhz sensor feeding data into Home Assistant. At this point you can configure lovelace to display your sensor information, or write automations based on the information.
If you have influxDB and Grafana setup, your sensor data will start showing up there as well.


~~One thing I didn't cover here is I still need to setup the rtl_433 command to run as a service at system start so the sensor data will be received as soon as the system restarts.~~
~~I will update this article once I have covered that step.~~

I have created another writeup explaining how to setup supervisor to autostart rtl_433 [here](http://blog.techreverence.com/autostart-rtl_433-with-supervisor.html)





