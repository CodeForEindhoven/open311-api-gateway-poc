# open311 gateway proof of concept
Simple proof of concept of a open311 gateway api, with loosly coupled *ServiceProviders*.
A *ServiceProvider* is a Micoservice that offers a single open311 service endpoint. see ```exampleServiceProvider.js``` for an example of how to implement one.

```
node gateway.js
node exampleServiceProvider.js
```
