import useAxios from "../hooks/useAxios"
function PaisesAdmin(){
    const { data: countries, loading, error } = useAxios("/countries/");
    console.log(countries)

    return (
        <>
        <div className="flex justify-between p-4 items-center bg-gray-100 mt-8 h-12 rounded-[10px] mx-4">
            <p className="bg-amber-300 text-[#3578C8]">Gestion de Países</p>
            <p className="text-4xl bg-amber-100 w-10 h-10 rounded-full text-white">+</p>
        </div>
        
        {countries?.map((item)=>(
            <div>
                <p>{item.id}</p>
            </div>            
        ))}
        </>
    )
}
export default PaisesAdmin