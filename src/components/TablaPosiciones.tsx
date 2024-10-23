import { useEffect, useState } from "react";

const URL_API_DATA = 'https://calabaza-api-app.diegoaporterol.workers.dev/api/calabaza'

export interface CalabazaI {
    id: number
    autor: string
    puntos: number
    url: string
}

function TableApp() {

    const [calabazas, setCalabazas] = useState<CalabazaI[]>([])

    useEffect(() => {
        fetch(URL_API_DATA)
            .then(res => res.json())
            .then(data => {
                setCalabazas(data)
            })
    }, [])

    return (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mt-4 image-container">
            {
                calabazas.map(calabaza => (
                    <div className="text-center" key={calabaza.id}>
                        <span className="font-bold text-xl font-[Creepster]">{calabaza.autor}</span>
                        <img className="mx-auto transition-all duration-300 hover:brightness-75 hover:scale-105"
                            src={calabaza.url} alt="calabaza" />
                        <div className="mb-4">Puntos: {calabaza.puntos}</div>
                        <div className="flex justify-center">
                            <button
                                onClick={() => {
                                    calabaza.puntos += 1
                                    const fileName = calabaza.url.split('/').pop();
                                    fetch(URL_API_DATA + `/${calabaza.id}`, {
                                        method: 'PUT',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            ...calabaza,
                                            puntos: calabaza.puntos,
                                            url: `https://res.cloudinary.com/dqvtr77op/image/upload/v1729491282/${fileName}`
                                        })
                                    }).then(res => res.json())
                                        .then(data => {
                                            setCalabazas(prev => {
                                                const index = prev.findIndex(value => value.id === calabaza.id);
                                                if (index === -1) return prev; // Si no se encuentra el elemento, retorna el array sin cambios
                                                const newArray = [...prev];
                                                newArray[index] = calabaza;
                                                return newArray;
                                            })
                                        })

                                }}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded flex items-center mr-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-notes mr-2">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M5 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
                                    <path d="M9 7l6 0" />
                                    <path d="M9 11l6 0" />
                                    <path d="M9 15l4 0" />
                                </svg>
                                Votar</button>

                            <button
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center"
                                onClick={() => {
                                    const fileName = calabaza.url.split('/').pop();
                                    calabaza.url = `https://res.cloudinary.com/dqvtr77op/image/upload/e_gen_background_replace:prompt_a%20spooky%20Halloween%20scene/v1729491282/${fileName}`
                                    setCalabazas(prev => {
                                        const index = prev.findIndex(value => value.id === calabaza.id);
                                        if (index === -1) return prev;
                                        const newArray = [...prev];
                                        newArray[index] = calabaza;
                                        return newArray;
                                    })
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-skull mr-2">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M12 4c4.418 0 8 3.358 8 7.5c0 1.901 -.755 3.637 -2 4.96l0 2.54a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1v-2.54c-1.245 -1.322 -2 -3.058 -2 -4.96c0 -4.142 3.582 -7.5 8 -7.5z" />
                                    <path d="M10 17v3" />
                                    <path d="M14 17v3" />
                                    <path d="M9 11m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                                    <path d="M15 11m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                                </svg>
                                Embrujar
                            </button>
                        </div>

                    </div>
                ))
            }
        </div>
    )

}

export default TableApp;