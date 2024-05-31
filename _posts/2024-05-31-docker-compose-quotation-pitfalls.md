---
title: "Avoiding Pitfalls with Quotation Marks in Docker Compose Environment Variables"
layout: post
published: true
date: 2024-05-31 10:23:57 +0200
categories:
  - uncategorized
tags:
  - untagged
lang: en
ref: docker-compose-quotation-pitfalls
---

{% include image.html align='alignright' url='/assets/media/pics/2024/docker-quotation.jpeg' img='/assets/media/pics/2024/docker-quotation.jpeg' title='Navigating Docker Compose environment variables: Best practices for seamless configuration.' caption='Navigating Docker Compose environment variables: Best practices for seamless configuration.' maxwidth='200px' %}


When working with Docker Compose, setting environment variables is a common task.
However, the way you format these variables can lead to unexpected issues, especially when dealing with quotation marks.
In this post, we'll explore a recent challenge I faced with the uptime monitoring tool [Gatus](https://github.com/TwinProduction/gatus) and provide best practices to avoid similar problems.

## The Problem

I recently tried to set up Gatus using Docker Compose. My initial `docker-compose.yml` looked something like this:

{% highlight yaml %}
services:
  gatus:
    container_name: gatus
    image: twinproduction/gatus:latest
    restart: unless-stopped
    ports:
      - "88:8080"
    environment:
      - GATUS_CONFIG_PATH="/config"
{% endhighlight %}

However, Gatus failed to locate the configuration files at `/config`. After some troubleshooting, I found that the issue was with the quotation marks around the environment variable value. Removing the quotation marks resolved the problem:

{% highlight yaml %}
services:
  gatus:
    container_name: gatus
    image: twinproduction/gatus:latest
    restart: unless-stopped
    ports:
      - "88:8080"
    environment:
      - GATUS_CONFIG_PATH=/config
{% endhighlight %}

## Understanding the Issue

Docker Compose uses YAML for configuration, and YAML handles quotation marks in a specific way.
When you enclose a value in quotation marks, those quotes become part of the value. In the case of a minimal Docker image like Gatus, which is built from scratch, the shell interprets these quotes literally, causing it to fail to find the intended path:

- **With quotes:**  
`GATUS_CONFIG_PATH="/config"`  
sets the variable to the literal string `"/config"`, including the quotes.
- **Without quotes:**  
`GATUS_CONFIG_PATH=/config`  
sets the variable to the string `/config`, as intended.

## Docker Compose Environment Variables

### Array Format vs. Key-Value Pairs Format

Docker Compose allows environment variables to be defined in two ways:

##### Array Format
   {% highlight yaml %}
   environment:
     - MY_VAR=value
     - MY_OTHER_VAR="another value"
   {% endhighlight %}

##### Key-Value Pairs Format
   {% highlight yaml %}
   environment:
     MY_VAR: value
     MY_OTHER_VAR: "another value"
   {% endhighlight %}

### When to Use Quotation Marks

- **Without Quotation Marks:**  
For simple strings without spaces, special characters, or reserved YAML characters, omit the quotes:  
`MY_VAR: value`
- **With Quotation Marks:**  
Use quotes for values with spaces or special characters to ensure proper parsing:  
`MY_OTHER_VAR: "another value"`

### Recommendations

##### Prefer Key-Value Pairs Format
   The key-value pairs format is more readable and avoids some of the parsing issues associated with the array format.
   {% highlight yaml %}
   services:
     myservice:
       environment:
         MY_VAR: value
         MY_OTHER_VAR: "another value"
   {% endhighlight %}

##### Use Quotes Judiciously
   Only use quotes when necessary to ensure correct parsing and avoid including them in the actual value.
   {% highlight yaml %}
   MY_VAR: simple_value
   MY_OTHER_VAR: "value with spaces"
   {% endhighlight %}

## Conclusion

Quotation marks can lead to subtle issues when setting environment variables in Docker Compose, especially with minimal Docker images like Gatus.
By understanding how YAML handles these values and following best practices, you can avoid these pitfalls and ensure your services run smoothly.


