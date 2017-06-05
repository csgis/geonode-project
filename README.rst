Geonode DAI Project
========================

This geonode project can be used for dainst geoserver instance.
The installation currently uses geonode 2.4. Be sure to double check this on every installation. All static files come from https://github.com/t-book/idai-components (have a look at the gulpfile). After a build all static files must be copied from /dist to /static.

Installation
------------

Create a new template ::
    
    $ cd /var/www
    $ sudo -E django-admin startproject NEW_PROJECT_NAME --template=https://github.com/t-book/geonode-project/archive/2.4.zip
 -epy,rst 
    $ sudo pip install -e NEW_PROJECT_NAME
    $ sudo chown -Rf www-data:www-data NEW_PROJECT_NAME && sudo chmod -Rf 755 NEW_PROJECT_NAME
    $ cd /var/www/NEW_PROJECT_NAME/
    $ sudo python manage.py collectstatic
    $ sudo python manage.py syncdb


After that be sure to change apache vhost configuration to point to our new project ::
    
    WSGIScriptAlias / /var/www/NEW_PROJECT_NAME/NEW_PROJECT_NAME
    Document Root /var/www/NEW_PROJECT_NAME/NEW_PROJECT_NAME

    $ sudo service apache2 restart
