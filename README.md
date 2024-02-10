# Collaborative-uml-editor

## Description
This project is a collaborative UML Class model editor that allows multiple 
users to work on the same UML diagram at the same time.

This editor supports a specific modelling session where users can create
a class model together by creating subtask for a specific modelling problem.
For each subtask the users can start an individual modelling session and
create a class model for the subtask. The class models for the subtasks are
then merged into a single class model for the whole modelling problem.

## Technologies
The project is based on the following technologies:
- [Django](https://www.djangoproject.com/) + [Django Channels](https://channels.readthedocs.io/en/latest/)
- [React](https://react.dev/) + [Material-UI ](https://mui.com/)+ [react-diagrams](https://github.com/projectstorm/react-diagrams)

## Installation
To install the project you need to have Docker and Docker Compose installed.
Then you can run the following command to start the project:

```bash
docker-compose build
docker-compose up
```

## Usage
After starting the project you can access the editor at the following URL:

[http://localhost](http://localhost) --> Frontend

[http://localhost/admin](http://localhost/admin) --> Backend

First you will need to create a superuser to access the admin interface and frontend. 
You can do this by running the following command:

```bash
docker-compose exec backend python manage.py createsuperuser
```
Then you can access the admin interface at the URL mentioned above and login.

For more Information to create other users look at the
[Django Documentation](https://docs.djangoproject.com/en/5.0/topics/auth/default/#creating-users/).

When you have a user you can login at the frontend and start using the collaborative uml.