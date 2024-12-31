from flask import Flask, request, jsonify
import pickle
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the trained model
with open('model (2).pkl', 'rb') as file:
    model = pickle.load(file)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get data from request
        data = request.get_json()
        
        # Extract features
        features = [
            float(data['type']),
            float(data['amount']),
            float(data['oldbalanceOrg']),
            float(data['newbalanceOrig'])
        ]
        
        # Reshape features for prediction
        features = np.array(features).reshape(1, -1)
        
        # Make prediction
        prediction = model.predict(features)[0]
        
        # Return prediction
        return jsonify({
            'success': True,
            'prediction': int(prediction),
            'message': 'Fraud' if prediction == 1 else 'Not Fraud'
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)