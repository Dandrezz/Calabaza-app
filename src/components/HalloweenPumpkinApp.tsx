import { useRef, useState, useEffect } from 'react';
import { Upload, Eraser } from 'lucide-react';

const URL_API_DATA = 'https://calabaza-api-app.diegoaporterol.workers.dev/api/calabaza'
const URL_CLOUDINARY = 'https://api.cloudinary.com/v1_1/dqvtr77op/image/upload'

function HalloweenPumpkinApp() {
    const canvasRef = useRef<any>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#FFA500');
    const [lineWidth, setLineWidth] = useState(2);
    const [autor, setAutor] = useState('Calabazin')

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }, [color, lineWidth]);

    const startDrawing = (e:any) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
    };

    const draw = (e:any) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.closePath();
        setIsDrawing(false);
    };

    const handleUpload = async () => {
        const canvas = canvasRef.current;
        const imageData = canvas.toDataURL('image/png');

        const data = new FormData()
        data.append('file', imageData)
        data.append('upload_preset', 'aqjx77cr')

        fetch(URL_CLOUDINARY, {
            method: "post",
            body: data
        }).then(res => res.json())
            .then(data => {
                console.log(data)
                fetch(URL_API_DATA, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        autor: autor,
                        puntos: 0,
                        url: data.secure_url
                    })
                }).then(res=>res.json())
                .then(data=>
                    window.location.href = '/tabla'
                )
            })
            .catch(err => {
                console.log(err)
            })

    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    return (
        <div className="flex flex-col items-center p-4">
            <h1 className="text-2xl font-bold mb-4 text-white font-[Creepster]">Dibuja tu Calabaza de Halloween</h1>

            <span className='text-white mb-4 text-2xl font-[Creepster]'>Nombre: {autor}</span>
            <input type="text" value={autor} className='mb-4 text-black' onChange={(e)=>{
                setAutor(e.target.value)
            }}/>

            <div className="mb-4 flex space-x-4">
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-10 h-10"
                />
                <input
                    type="range"
                    min="1"
                    max="20"
                    value={lineWidth}
                    onChange={(e) => setLineWidth(parseInt(e.target.value, 10))}
                    className="w-32"
                />
                <button
                    onClick={clearCanvas}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded flex items-center"
                >
                    <Eraser className="mr-2" />
                    Borrar
                </button>
            </div>
            <canvas
                ref={canvasRef}
                width={400}
                height={400}
                onMouseDown={startDrawing}
                onMouseMove={(e)=>draw(e)}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="border border-gray-300 mb-4 rounded-md"
            />
            <button
                onClick={handleUpload}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded flex items-center"
            >
                <Upload className="mr-2" />
                Subir y Mejorar
            </button>

        </div>
    );
}

export default HalloweenPumpkinApp
