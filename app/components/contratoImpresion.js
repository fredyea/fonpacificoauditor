import React, { useState, useEffect } from "react";
import { FiUpload } from "react-icons/fi";
import { saveAs } from 'file-saver';
const _servidorapipdf = `${process.env.NEXT_PUBLIC_API_URLPDF}/`
const _servidorapi = `${process.env.NEXT_PUBLIC_API_URL}/`

let Docxtemplater, PizZip;
if (typeof window !== 'undefined') {
  Docxtemplater = require('docxtemplater');
  PizZip = require('pizzip');
}



const Contratoimpresion = (idcontrato) => {
    ///
    console.log(idcontrato)
    const [isClient, setIsClient] = useState(false);
    const [c_contrato, setContrato] = useState('ARRR');

    const [c_fechacarta, setC_fechacarta] = useState('Sin fecha');
    const c_idcontrato = idcontrato
  const [c_nombreasociado, setC_nombreasociado] = useState('ASOCIADO XXX');
  const [c_nombrecontratista, setC_nombrecontratista] = useState('CONTRATISTA XXX');
  const [c_nit, setC_nit] = useState('99999xx');
  const [c_dia, setC_dia] = useState('1xx');
  const [c_meses, setC_meses] = useState('6x');
  const [c_mes, setC_mes] = useState('Eneroxx');
  const [c_fechadesde, setC_fedesde] = useState('1 de Enero el 2025x');
  const [c_fechahasta, setC_fechahasta] = useState('30 de junio del 2025');
  const [c_ano, setC_ano] = useState('2025x');
  const [c_direccion, setC_direccion] = useState('Sin direccionxx');
  const [c_grado, setC_grado] = useState('SIN GRADOx');
  const [c_valor, setC_valor] = useState('$00.00x');
  const [c_email, setC_email] = useState('email@rerere');
  const [c_telefono, setC_telefono] = useState('55665666');
  const [c_ciudad, setC_ciudad] = useState('Bogota');
  const [cedularepresentante2, setCedularepresentante2] = useState('Juan Perez');
  const [c_objeto, setC_objeto] = useState('XXXXEJEMPLO');
    //
  const [showDialog, setShowDialog] = useState(false);
  const [showDialogd, setShowDialogd] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchContrato();
  }, []);

  const fetchContrato = async () => {
    try {
      const response = await fetch(_servidorapi + `contratosrhxid?id_contrato=${c_idcontrato.idcontrato}`);
      if (!response.ok) throw new Error('Error al cargar los datos');
      const data = await response.json();
      console.log('Datos del contrato XXX:', data);
      console.log('Datos del ID:', c_idcontrato);
      if (data && data.length > 0) {
        console.log('Primer elemento:', data[0]);
        setContrato(data[0].codigo || '');
        fetchProveedor(data[0].id_proveedor);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar los datos del contrato');
    }
  };


  const fetchProveedor = async (idproveedor) => {
    try {
      const response = await fetch(_servidorapi + `proveedorxid?id_proveedor=${idproveedor}`);
      if (!response.ok) throw new Error('Error al cargar los datos');
      const data = await response.json();
      console.log('Datos del proveedor:', data);
      if (data && data.length > 0) {
        console.log('Primer elemento:', data[0]);
        setC_direccion(data[0].direccion || '');
        setC_nombrecontratista(data[0].Nombre || '');
        setC_nit(data[0].codigo || '');
        setC_direccion(data[0].direccion || '');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar los datos del contrato');
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      alert("Please select a valid PDF file.");
    }
  };
  const handleGenerar = () => {
    setShowDialog(true);
  };

  const handleGuardar = () => {
    setShowDialogd(true);
  };

  const handleConfirm = () => {
    processDocument()
    setShowDialog(false);
  };

  const handleConfirmd = () => {
    console.log(idcontrato)
    const idcontratox = idcontrato.idcontrato
    console.log(idcontratox)
      console.log('EStoy en 1 ')
      const formdata = new FormData();
      console.log('EStoy en 2 ')
      formdata.append('id_contrato', idcontratox);
      console.log('EStoy en 3 ')
      formdata.append('image', selectedFile);
      console.log('EStoy en 4 ')
      fetch(_servidorapi + 'contratoactadeaceptacion', {
        method: 'POST',
        body: formdata
      })
      .then(res => res.text())
      .then(res => {        
      })
      .catch(err => {
        console.error(err);
      });
    
      // Reiniciar los valores
      setShowDialogd(false);
    };
   

  const handleCancel = () => {
    setShowDialog(false);
  };

  const processDocument = async () => {
    setIsClient(true); 
   try {
      console.log('EStoy en 1')
      const response = await fetch('/CONTRATO_POR_ OBJETIVO.docx');
      console.log('EStoy en 2')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      console.log('EStoy en 3')
      const zip = new PizZip(arrayBuffer);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });
      console.log('EStoy en 4')
      // Reemplazar los datos en el documento
      doc.setData({
        c_fechacarta: "Sin fecha",
        c_nombreasociado: "ASOCIADO XXX",
        c_nombrecontratista,
        c_nit,
        c_direccion,
        c_email,
        c_telefono,
        c_ciudad,
        cedularepresentante2,
        c_objeto,
        c_contrato,
        c_ano,
        c_mes,
        c_fechadesde,
        c_fechahasta,
        c_dia,
        c_meses,
        c_grado,
        c_valor,

      });
      console.log('EStoy en 5')
      doc.render();
      console.log('EStoy en 6')
      const out = doc.getZip().generate({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      console.log('EStoy en 7')
      // Guardar el archivo con un nuevo nombre
      saveAs(out, `Contrato_${c_contrato+'_'+Date.now()}.docx`);
      console.log('EStoy en 8')
    } catch (error) {
      console.error('Error al procesar el documento:', error);
      alert('Hubo un error al procesar el documento. Por favor, verifica que el archivo sea válido y esté en la ubicación correcta.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-xl font-bold mb-4 text-center text-gray-800">CONTRATO</h2>
      
      <div className="mb-3">
        <label htmlFor="pdfInput" className="block text-sm font-medium text-gray-700 mb-1">
          Selecione el Pdf
        </label>
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="pdfInput"
            className="flex flex-col items-center justify-center w-full h-20 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pt-2 pb-2">
              <FiUpload className="w-6 h-6 mb-1 text-gray-400" />
              <p className="mb-1 text-xs text-gray-500">
                <span className="font-semibold">Click para Seleccionarlo</span> o Arrastrelo
              </p>
              <p className="text-xs text-gray-500">PDF (MAX. 1MB)</p>
            </div>
            <input
              id="pdfInput"
              type="file"
              className="hidden"
              accept=".pdf"
              onChange={handleFileChange}
              aria-label="Upload PDF file"
            />
          </label>
        </div>
      </div>
      
      {selectedFile && (
        <p className="text-xs text-gray-600 mb-3">
          Selected file: {selectedFile.name}
        </p>
      )}
      <div className="flex space-x-5">
  <button
    onClick={handleGenerar}
    className="flex-1 bg-blue-500 text-white py-1.5 px-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out text-sm"
    aria-label="Generate"
  >
    Generar
  </button>
  <button
    onClick={handleGuardar}
    className="flex-1 bg-blue-500 text-white py-1.5 px-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out text-sm"
    aria-label="Generate"
  >
    Guardar
  </button>
</div>
      {showDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-xl">
            <h3 className="text-base font-bold mb-3">Generar Documento</h3>
            <p className="mb-3 text-sm">Vamos a generar el contrato desde una plantilla, estas de acuerdo?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-300 ease-in-out text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out text-sm"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
          {showDialogd && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-xl">
            <h3 className="text-base font-bold mb-3">Guardar Documento</h3>
            <p className="mb-3 text-sm">Guardaremos este documento, asi quedo?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-300 ease-in-out text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmd}
                className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out text-sm"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contratoimpresion;
