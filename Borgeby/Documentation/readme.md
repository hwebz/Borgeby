# EmptyEpi Template Site

Information about the EmptyEpi solution. This is intended for developers and tech resources.

## Source code
The project can be cloned from the following git repository: `https://epicgi.visualstudio.com/CGI.EPiServer/_git/EPiServer%20Template`.

We use Git Flow, which means that coding is done in the develop branch or specific feature branches. We merge to master branch only when we start a new customer project that is based on this template site.

## Database
The EPiServer dev database should exist on each developers' computer. The reason is to avoid conflicts that could slow down development. A zip file containing the database can be found in the projects root directory. Copy the MDF file to the APP_Data folder.

## Run the site
The project is configured to run under IIS Express, no site needs to be setup in IIS Manager. To start the site, make sure that the project `EmptyEpi` is set as startup project, then click "Start without debugging" in Visual Studio (Ctrl + F5).
