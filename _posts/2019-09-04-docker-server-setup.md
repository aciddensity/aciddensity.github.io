---
title: Docker Server Setup
date: 2019-09-04 21:12
published: false
category: Documentation
tags: linux docker
slug: docker-server-setup
authors: Acid Density
summary: Current Docker configuration
layout: post
---


# Synopsis #
In this post I will attempt to outline my current configuration for my Docker server.



## General Info ##
The Docker host is running on a Lenovo M92P work station running Linux Mint 18.1. This distro was chosen only because that's what I had on hand at the time.
If I were to redo the server I would chose something like Ubuntu Server, CentOS, or possibly Regolith.



### Current Docker Containers ###
| Container Name | Bound Ports | Bound Volumes |  
| -------------- | ----------- | ------------- |  
| Heimdall       | 80 -> 9080  |       ?       |  
| Home Assistant |     ?       |       ?       |  
| InfluxDB       |     ?       |       ?       |  
| Grafana        |     ?       |       ?       |  
| PiHole         |     ?       |       ?       |  
| Torrents-CSV   |     ?       |       ?       |  



### Port Bindings ###
***Important: None of my containers are accessible from outside my home network, not even my Home Assistant.***


