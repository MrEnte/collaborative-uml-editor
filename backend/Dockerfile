# base image  
FROM python:3.11-slim

# install dependencies  
RUN pip install --upgrade pip  

# copy whole project to your docker home directory. 
COPY ./requirements.txt .

# run this command to install all dependencies  
RUN pip install -r requirements.txt

COPY . /app
WORKDIR /app


COPY ./entrypoint.sh .
ENTRYPOINT ["sh", "/app/entrypoint.sh"]
