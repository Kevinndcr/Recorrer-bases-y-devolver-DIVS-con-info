""" ================================================================================================
Institucion..: Universidad Tecnica Nacional
Sede.........: Del Pacifico
Carrera......: Tecnologias de Informacion
Periodo......: 3-2021
Charla.......: Uso de Python para crear interface proyecto Web 1
Documento....: api_data_02.py
Objetivos....: Demostracion de un micro servicio web con api-REST.
Profesor.....: Jorge Ruiz (york)
Estudiante...:
================================================================================================"""
# -------------------------------------------------------
# Import libraries API service support
# -------------------------------------------------------
from datetime import datetime
import random
from pymongo import MongoClient
from bson.objectid import ObjectId

#Conexion con el mongo
conex = MongoClient(host=['127.0.0.1:27017'])

#                                                   BASE DE DATOS A LA QUE SE VA A CONECTAR, SE CREA UNA SI NO EXISTE
conexDB = conex.usuarios_registrados

from flask import Flask, jsonify, abort, make_response, request
from flask_cors import CORS

# Create flask app
app = Flask(__name__)
CORS(app)

# Make the WSGI interface available at the top level so wfastcgi can get it.
wsgi_app = app.wsgi_app


# -------------------------------------------------------
# Create local API functions
# -------------------------------------------------------
def token():
    ahora = datetime.now()
    antes = datetime.strptime("1970-01-01", "%Y-%m-%d")
    return str(hex(abs((ahora - antes).seconds) * random.randrange(10000000)).split('x')[-1]).upper()

# -------------------------------------------------------
# Error control, httpRequest rules
# -------------------------------------------------------
@app.errorhandler(400)
def bad_request(error):
    return make_response(jsonify({'error': 'Bad request....!'}), 400)

@app.errorhandler(401)
def unauthorized(error):
    return make_response(jsonify({'error': 'Unauthorized....!'}), 401)

@app.errorhandler(403)
def forbiden(error):
    return make_response(jsonify({'error': 'Forbidden....!'}), 403)

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found....!'}), 404)

@app.errorhandler(500)
def not_found(error):
    return make_response(jsonify({'error': 'Inernal Server Error....!'}), 500)

# -----------------------------------------------------
# Create routes and intereste user control functions
# -----------------------------------------------------

##              HACIENDO UN POST DESDE PAGINA WEB           ##

# Interested user signup, register new interested
@app.route('/insertar_usuario', methods=['POST']) ##      <---- Esta es la URL que va a ejecutar la API, o sea, 
#                                                           el metodo que se ejecuta al hacer POST 
def create_user():
    if not request.json or \
            not 'name' in request.json or \
            not 'email' in request.json or \
            not 'passwd' in request.json:
        abort(400)

    user = {
        'name': request.json['name'],
        'email': request.json['email'],
        'passwd': request.json['passwd']
    }
    try:                    #tabla
        result = conexDB.usuarios_registrados.insert_one(user) # <------      Base de datos en el MONGO, si no existe en el mongo se CREA UNA NUEVA automaticamente
        user2 = {
            'token':str(result.inserted_id),
            'name': request.json['name']
        }
        data = {
            "status_code": 201,
            "status_message": "Data was created",
            "data": {'interested': user2}
        }
    except Exception as expc:
        abort(500)
    return jsonify(data), 201

@app.route('/recorrer_bases', methods=['GET']) 
def get_users():
    try:
        # Recupera todos los documentos de la colección usuarios_registrados
        cursor = conexDB.usuarios_registrados.find()
        
        # Inicializa una lista para almacenar los usuarios
        users_list = []
        
        # Recorre cada documento en el cursor y agrega los datos a la lista
        for user_doc in cursor:
            user_data = {
                'name': user_doc['name'],
                'email': user_doc['email'],
                'passwd': user_doc['passwd']
            }
            users_list.append(user_data)
        
        # Construye la respuesta JSON
        data = {
            "status_code": 200,
            "status_message": "Data retrieved successfully",
            "data": {'users': users_list}
        }
        
        return jsonify(data), 200
    
    except Exception as expc:
        # En caso de error, retorna un error 500
        abort(500)




if __name__ == '__main__':
    HOST = '0.0.0.0'
    PORT = 5001
    app.run(HOST, PORT)

