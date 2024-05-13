---
title: Autostart rtl_433 with Supervisor
date: 2019-11-17 00:00
category: Home-Automation
tags: Linux Home-Assistant RTL_SDR Radio
slug: autostart-rtl_433-with-supervisor
authors: Acid Density
summary: Setting up rtl_433 to auto start with Supervisor
published: true
layout: post
---

First we start by making sure supervisor is installed

```bash
sudo pip install supervisor
```

Make some directories for supervisor to use, and ensure your user has permissions to write to them.

```bash
sudo mkdir /var/log/supervisor
sudo chown -R <user>:<user> /var/log/supervisor
sudo mkdir /var/run/supervisor
sudo chown -R <user>:<user> /var/run/supervisor
```

Create the Supervisor conf file 

```bash
sudo nano /usr/local/etc/supervisord.conf
```

Here is the configuration that I used, you will want to replace <user> with your user name.

```text
[supervisord]
pidfile = /var/run/supervisor/supervisord.pid
user = <user>
identifier = supervisor
directory = /tmp
logfile = /var/log/supervisor/supervisord.log
	
	
[program:rtl_433]
command=/usr/local/bin/rtl_433 -F "mqtt://<mqtt_IP>,retain=0,devices=rtl_433[/model][/id]"
autostart=true
autorestart=true
stderr_logfile=/var/log/supervisor/long.err.log
stdout_logfile=/var/log/supervisor/long.out.log
```

If everything went right you should now be running rtl_433 and serving data to your mqtt host.
Let's double check that.

```text
ps aux | grep rtl_433
```

Which gives this for output:

```text
<user>     19199  1.2  0.1  65764  9368 ?        Sl   19:49   0:00 /usr/local/bin/rtl_433 -F mqtt://<mqtt_IP> retain 0 devices rtl_433[/model][/id]
```

You should now be good to go.

