from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/detect_hand', methods=['POST'])
def detect_hand():
    if 'image' in request.files:
        # file
        image = request.files['image']
    else:
        # webcam
        image = request.data

    # models foes here
    landmarks = detect_hand_in_image(image)

    return jsonify({'landmarks': landmarks})

def detect_hand_in_image(image):
    # assure its normalized
    landmarks = [{'x': 0.1, 'y': 0.2}, {'x': 0.3, 'y': 0.4}, {'x': 0.5, 'y': 0.6}]
    
    return landmarks

if __name__ == '__main__':
    app.run(debug=True)
