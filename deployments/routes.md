oc expose svc/apiservice --hostname example-food-food-delivery.anthonyamanse-4-5-f2c6cdc6801be85fd188b09d006f13e3-0000.us-east.containers.appdomain.cloud --path /createOrder --name path-createorder

oc expose svc/apiservice --hostname example-food-food-delivery.anthonyamanse-4-5-f2c6cdc6801be85fd188b09d006f13e3-0000.us-east.containers.appdomain.cloud --path /status --name path-status

oc expose svc/apiservice --hostname example-food-food-delivery.anthonyamanse-4-5-f2c6cdc6801be85fd188b09d006f13e3-0000.us-east.containers.appdomain.cloud --path /restaurants --name path-restaurants

oc expose svc/apiservice --hostname example-food-food-delivery.anthonyamanse-4-5-f2c6cdc6801be85fd188b09d006f13e3-0000.us-east.containers.appdomain.cloud --path /user --name path-user

oc expose svc/realtimedata --hostname example-food-food-delivery.anthonyamanse-4-5-f2c6cdc6801be85fd188b09d006f13e3-0000.us-east.containers.appdomain.cloud --path /events --name path-realtimedata