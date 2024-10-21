import { useEffect, useState } from "react";

const URL_API_DATA = 'https://calabaza-api-app.diegoaporterol.workers.dev/api/calabaza'
const URL_CLOUDINARY = 'https://api.cloudinary.com/v1_1/dqvtr77op/image/upload'

function TableApp() {

    const [calabazas, setCalabazas] = useState([])

    useEffect(() => {

        fetch(URL_API_DATA)
            .then(res => res.json())
            .then(data => {
                setCalabazas(data)
            })

    }, [])



    return (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4">
            {
                calabazas.map(calabaza => (
                    <div className="text-center" key={calabaza.id}>
                        <span className="font-bold text-xl">{calabaza.autor}</span>
                        <img className="mx-auto" src={calabaza.url} alt="calabaza" />
                        <div className="mb-4">Puntos: {calabaza.puntos}</div>
                        <button 
                            onClick={()=>{
                                calabaza.puntos += 1
                                fetch(URL_API_DATA+`/${calabaza.id}`, {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        ...calabaza,
                                        puntos: calabaza.puntos
                                    })
                                }).then(res=>res.json())
                                .then(data=>{
                                    console.log(data)
                                    setCalabazas(prev=>{
                                        const prevFiltered = prev.filter((value) => value.id !== calabaza.id);
                                        console.log([...prevFiltered, calabaza])
                                        return [...prevFiltered, calabaza];
                                    })
                                })

                            }}
                            className="bg-[#f97316] text-white px-4 py-2 rounded flex items-center mx-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-notes mr-2">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M5 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
                                <path d="M9 7l6 0" />
                                <path d="M9 11l6 0" />
                                <path d="M9 15l4 0" />
                            </svg>
                            Votar</button>
                    </div>
                ))
            }
        </div>
    )

}

export default TableApp;