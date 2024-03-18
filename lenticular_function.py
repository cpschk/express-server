import numpy as np
import sys
import json
import cv2
import base64

def procesar_json(data):
    image1 = data['image1']
    image2 = data['image2']
    LPI = data['LPI']
    width = data['width']
    height = data['height']
    image_result = merge_lenticular_images_with_resizing(image1, image2, LPI, width, height)
    data['result_image'] = image_result
    # return data
    return json.dumps(data)

def load_image_from_base64(base64_string):
    # Eliminar el prefijo "data:image/jpeg;base64," antes de decodificar
    _, base64_data = base64_string.split(',', 1)
    # Decodificar la cadena base64 en una matriz de bytes
    image_data = base64.b64decode(base64_data)
    # Convertir los datos de imagen en un arreglo numpy
    nparr = np.frombuffer(image_data, np.uint8)
    # Decodificar la imagen usando OpenCV
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return image

def convert_image_to_base64(image):
    # Codificar la imagen como una cadena base64
    _, buffer = cv2.imencode('.jpg', image)
    image_base64 = base64.b64encode(buffer).decode('utf-8')
    # Agregar el prefijo "data:image/jpeg;base64,"
    image_base64_with_prefix = "data:image/jpeg;base64," + image_base64
    return image_base64_with_prefix

def merge_lenticular_images_with_resizing(image1base64_string, image2base64_string, LPI, new_width, new_height):
    """
    Fusiona dos imágenes lenticulares redimensionándolas al mismo tamaño.

    Args:
        image1: Primera imagen lenticular.
        image2: Segunda imagen lenticular.
        LPI: Número de lentes por pulgada en la rejilla lenticular.
        new_width: Nuevo ancho deseado para las imágenes.
        new_height: Nueva altura deseada para las imágenes.

    Returns:
        La imagen fusionada.
    """
    image1 = load_image_from_base64(image1base64_string)
    image2 = load_image_from_base64(image2base64_string)
    # Redimensionar ambas imágenes al nuevo tamaño
    resized_image1 = cv2.resize(image1, (new_width, new_height))
    resized_image2 = cv2.resize(image2, (new_width, new_height))

    # Calcular el ancho de las lentes
    lens_width = 1 / LPI

    # Leer las dimensiones de las imágenes redimensionadas
    height, width, _ = resized_image1.shape

    # Calcular el tamaño de cada segmento (lente)
    segment_width = int(width * lens_width)

    # Inicializar la imagen resultante con la misma forma que la primera imagen
    merged_image = np.zeros_like(resized_image1)

    # Recorrer cada segmento (lente)
    for i in range(0, width, segment_width):
        # Tomar una lente de la primera imagen
        segment_from_image1 = resized_image1[:, i:i+segment_width]

        # Tomar una lente de la segunda imagen
        segment_from_image2 = resized_image2[:, i:i+segment_width]

        # Fusionar las lentes
        merged_segment = cv2.addWeighted(segment_from_image1, 0.5, segment_from_image2, 0.5, 0)

        # Actualizar la imagen resultante con el segmento fusionado
        merged_image[:, i:i+segment_width] = merged_segment

        cv2.imwrite('imagen_procesada.jpg', merged_image)

    return convert_image_to_base64(merged_image)


if __name__ == "__main__":
    data = json.loads(sys.stdin.read())
    result = procesar_json(data)
    print(result)