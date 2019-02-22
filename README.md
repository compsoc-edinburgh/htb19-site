# Hack the Burgh 2019 website

This is the website for [HTB 2019](http://2019.hacktheburgh.com).

## How to test

The quickest and easiest way to test, if you have Docker installed, is to run the following command (make sure your current directory is this repository):

```
docker run --volume=$(pwd):/src:Z --publish 4000:4000 grahamc/jekyll serve --watch -H 0.0.0.0
```

If you don't have docker, [install jekyll](https://jekyllrb.com/docs/installation/) and run this:

```
$ git clone https://github.com/compsoc-edinburgh/htb19-site
$ cd htb19-site
$ jekyll serve
```
