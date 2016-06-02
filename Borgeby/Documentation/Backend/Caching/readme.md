# Caching

## Cache burst for CSS and JavaScript
Cache burst works by adding a string, a fingerprint, to the local css or js file. The fingerprint is created and cached in the HttpRuntime cache environment and will make the path to the resources unique as long the cached fingerprint lives. 

In web.config there is a rewrite rule added to remove the fingerprint from the path and return the correct file.

A new css or js file will trigger a different fingerprint as the runtime environment is recycled on every deploy, thus enforcing creation of a new fingerprint.

[Read more](http://madskristensen.net/post/cache-busting-in-aspnet)