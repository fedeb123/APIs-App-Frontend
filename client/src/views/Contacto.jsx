export default function Contacto() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Contacto</h1>
      <p className="mt-2"><form action=""></form></p>
        <form action="">
          <input type="text" placeholder="Tu nombre" className="border p-2 w-full mb-2" />
          <input type="email" placeholder="Tu email" className="border p-2 w-full mb-2" />
          <textarea placeholder="Tu mensaje" className="border p-2 w-full mb-2"></textarea>
          <button type="submit" className="bg-blue-500 text-white p-2">Enviar</button>
        </form>
    </div>
  );
}
