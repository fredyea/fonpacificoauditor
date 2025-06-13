'use client';

import { useState, useEffect, Fragment } from 'react';
import { use } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { PlusIcon, TrashIcon, DocumentArrowDownIcon, ArrowUpTrayIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import ContentLayout from '../../../../components/ContentLayout';
import Contratoimpresion from '../../../../components/contratoImpresion';

const _servidorapi = `${process.env.NEXT_PUBLIC_API_URL}/`

export default function ContratistaDetalle({ params }) {
  const router = useRouter();
  const [avatarFile, setAvatarFile] = useState(null);
  const [eps, setEps] = useState([]);
  const [pension, setPension] = useState([]);
  const [contrato, setContrato] = useState([]);
  const [id_contrato, setIdContrato] = useState(0);
  const [riesgos, setRiesgos] = useState([]);
  const [profesiones, setProfesiones] = useState([]);
  const [estudios, setEstudios] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [workflow, setWorkflow] = useState([]);
  const [organigrama, setOrganigrama] = useState([]);
  const [selectedEps, setSelectedEps] = useState('');
  const [selectedPension, setSelectedPension] = useState('');
  const [selectedRiesgo, setSelectedRiesgo] = useState('');
  const [selectedProfesion, setSelectedProfesion] = useState('');
  const [experiencia, setExperiencia] = useState('');
  const [especializacion, setEspecializacion] = useState('');
  const [xcontrato, setXcontrato] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingPerfil, setIsUpdatingPerfil] = useState(false);

  const [showAddEstudioModal, setShowAddEstudioModal] = useState(false);
  const [showAddActividadModal, setShowAddActividadModal] = useState(false);
  const [nuevoEstudio, setNuevoEstudio] = useState({
    titulo: '',
    institucion: '',
    ano_fin: ''
  });
  const [isDeletingEstudio, setIsDeletingEstudio] = useState(false);
  const [nuevaActividad, setNuevaActividad] = useState({
    nombre: '',
    id_workflow: '',
    dias: '',
    horas: ''
  });
  const [isDeletingActividad, setIsDeletingActividad] = useState(false);
  
  const [showUpdateContratoModal, setShowUpdateContratoModal] = useState(false);
  const [tiposContratos, setTiposContratos] = useState([]);
  const [compromisos, setCompromisos] = useState([]);
  const [contratoData, setContratoData] = useState({
    id_tipoContrato: '',
    objeto: '',
    fecha_inicio: new Date().toISOString().split('T')[0],
    fecha_fin: new Date().toISOString().split('T')[0],
    valor: '',
    id_compromiso: '',
    id_organigrama: ''
  });
  
  const [showConfirmContratoModal, setShowConfirmContratoModal] = useState(false);
  
  const [showImprimirModal, setShowImprimirModal] = useState(false);
  
  // Use React.use() to unwrap the params
  const decodedParams = use(params);
  const itemData = JSON.parse(decodeURIComponent(decodedParams.id));
  const id = itemData.id_contratista;
  const nombrecontratista = itemData.nombre;

  useEffect(() => {
    setIdContrato(itemData.id_contrato);
    console.log('id_contratoxx:', itemData.id_contrato);
    fetchEps();
    fetchPension();
    fetchRiesgos();
    fetchProfesiones();
    // Establecer valores iniciales desde itemData
    setSelectedEps(itemData.id_eps || '');
    setSelectedPension(itemData.id_pension || '');
    setSelectedRiesgo(itemData.id_riesgo || '');
    setSelectedProfesion(itemData.id_profesion || '');
    setExperiencia(itemData.experiencia || '');
    setEspecializacion(itemData.especialidad || '');
    fetchEstudios();
    fetchActividades();
    fetchWorkflow();
    fetchTiposContratos();
    fetchCompromisos();
    fetchOrganigrama();
  }, []);

  useEffect(() => {
    if (id_contrato) {
      fetchContrato();
    }
  }, [id_contrato]);

  const handleUpdateSeguridadSocial = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(_servidorapi + 'actualizarrhseguridadsocial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_contratista: id,
          id_eps: selectedEps,
          id_pension: selectedPension,
          id_riesgo: selectedRiesgo
        }),
      });

      if (!response.ok) throw new Error('Error al actualizar');
      
      toast.success('Información de seguridad social actualizada exitosamente');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar la información');
    } finally {
      setIsUpdating(false);
    }
  };

  const fetchEps = async () => {
    try {
      const response = await fetch(_servidorapi + 'maestrorheps');
      if (!response.ok) throw new Error('Error al cargar los datos');
      const data = await response.json();
      setEps(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar los tipos de impuestos');
    }
  };

  const fetchEstudios = async () => {
    try {
      const response = await fetch(_servidorapi + `contratistasrhestudios?id=${id}`);
      if (!response.ok) throw new Error('Error al cargar los datos');
      const data = await response.json();
      setEstudios(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar los estudios');
    }
  };

  const fetchActividades = async () => {
    try {
      const response = await fetch(_servidorapi + `contratistasrhactividades?id=${id}`);
      if (!response.ok) throw new Error('Error al cargar los datos');
      const data = await response.json();
      setActividades(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar los tipos de impuestos');
    }
  };

  
  const fetchContrato = async () => {
    try {
      console.log('id_contrato',id_contrato);
      const response = await fetch(_servidorapi + `contratistasrhcontratistascontratos?id_contrato=${id_contrato}`);
      if (!response.ok) throw new Error('Error al cargar los datos');
      const data = await response.json();
      console.log('Datos del contrato:', data);
      setContrato(data);
      if (data && data.length > 0) {
        console.log('Primer elemento:', data[0]);
        setXcontrato(data[0].codigo || '');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar los datos del contrato');
    }
  };

  const fetchPension = async () => {
    try {
      const response = await fetch(_servidorapi + 'maestrorhpension');
      if (!response.ok) throw new Error('Error al cargar los datos');
      const data = await response.json();
      setPension(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar los tipos de impuestos');
    }
  };

  const fetchWorkflow = async () => {
    try {
      const response = await fetch(_servidorapi + 'maestroworkflow');
      if (!response.ok) throw new Error('Error al cargar los datos');
      const data = await response.json();
      setWorkflow(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar los tipos de impuestos');
    }
  };

  const fetchRiesgos = async () => {
    try {
      const response = await fetch(_servidorapi + 'maestrorhriesgos');
      if (!response.ok) throw new Error('Error al cargar los datos');
      const data = await response.json();
      setRiesgos(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar los tipos de impuestos');
    }
  };

  const fetchProfesiones = async () => {
    try {
      const response = await fetch(_servidorapi + 'maestrorhprofesiones');
      if (!response.ok) throw new Error('Error al cargar los datos');
      const data = await response.json();
      setProfesiones(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar las profesiones');
    }
  };

  const handleUpdatePerfil = async () => {
    setIsUpdatingPerfil(true);
    try {
      const response = await fetch(_servidorapi + 'actualizarrhperfil', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_contratista: id,
          id_profesion: selectedProfesion,
          experiencia: experiencia,
          especializacion: especializacion
        }),
      });

      if (!response.ok) throw new Error('Error al actualizar');
      
      toast.success('Perfil actualizado exitosamente');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar el perfil');
    } finally {
      setIsUpdatingPerfil(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    toast.success('Avatar actualizado exitosamente');
  };

  const handleDeleteEstudio = async (mi_id) => {
    setIsDeletingEstudio(true);
    try {
      const response = await fetch(_servidorapi + 'eliminarrhestudio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mi_id: mi_id
        }),
      });

      if (!response.ok) throw new Error('Error al eliminar');
      
      await fetchEstudios(); // Recargar la lista
      toast.success('Estudio eliminado exitosamente');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar el estudio');
    } finally {
      setIsDeletingEstudio(false);
    }
  };

  const handleAddEstudio = async () => {
    try {
      // Validar que el año sea numérico
      if (!/^\d+$/.test(nuevoEstudio.ano_fin)) {
        toast.error('El año debe contener solo números');
        return;
      }

      const response = await fetch(_servidorapi + 'agregarrhestudio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_contratista: id,
          ...nuevoEstudio
        }),
      });

      if (!response.ok) throw new Error('Error al agregar');
      
      await fetchEstudios(); // Recargar la lista
      setShowAddEstudioModal(false);
      setNuevoEstudio({ titulo: '', institucion: '', ano_fin: '' });
      toast.success('Estudio agregado exitosamente');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al agregar el estudio');
    }
  };

  const handleDeleteActividad = async (mi_id) => {
    setIsDeletingActividad(true);
    try {
      const response = await fetch(_servidorapi + 'eliminarrhactividad', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mi_id: mi_id
        }),
      });

      if (!response.ok) throw new Error('Error al eliminar');
      
      await fetchActividades(); // Recargar la lista
      toast.success('Actividad eliminada exitosamente');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar la actividad');
    } finally {
      setIsDeletingActividad(false);
    }
  };

  const handleAddActividad = async () => {
    try {
      // Validar que días y horas sean numéricos
      if (!/^\d+$/.test(nuevaActividad.dias) || !/^\d+$/.test(nuevaActividad.horas)) {
        toast.error('Días y horas deben contener solo números');
        return;
      }

      const response = await fetch(_servidorapi + 'agregarrhactividad', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_contratista: id,
          ...nuevaActividad
        }),
      });

      if (!response.ok) throw new Error('Error al agregar');
      
      await fetchActividades(); // Recargar la lista
      setShowAddActividadModal(false);
      setNuevaActividad({ nombre: '', id_workflow: '', dias: '', horas: '' });
      toast.success('Actividad agregada exitosamente');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al agregar la actividad');
    }
  };

  const fetchTiposContratos = async () => {
    try {
      const response = await fetch(_servidorapi + 'maestrotiposcontratos');
      if (!response.ok) throw new Error('Error al cargar los datos');
      const data = await response.json();
      setTiposContratos(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar los tipos de contratos');
    }
  };

  const fetchCompromisos = async () => {
    try {
      const response = await fetch(_servidorapi + 'maestrocompromisos');
      if (!response.ok) throw new Error('Error al cargar los datos');
      const data = await response.json();
      setCompromisos(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar los compromisos');
    }
  };

  const fetchOrganigrama = async () => {
    try {
      const response = await fetch(_servidorapi + 'maestrorhperfiles');
      if (!response.ok) throw new Error('Error al cargar los datos');
      const data = await response.json();
      setOrganigrama(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar el organigrama');
    }
  };

  const handleUpdateContrato = async () => {
    try {
      const response = await fetch(_servidorapi + 'actualizarrhcontrato', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_contratista: id,
          ...contratoData
        }),
      });

      if (!response.ok) throw new Error('Error al actualizar');
      
      setShowUpdateContratoModal(false);
      toast.success('Contrato actualizado exitosamente');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar el contrato');
    }
  };


  const handleUpdateContratodeshabilitar = async () => {
    try {
      const response = await fetch(_servidorapi + 'actualizarrhcontratodeshabilitar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_contratista: id
        }),
      });

      if (!response.ok) throw new Error('Error al actualizar');
      
     
    } catch (error) {
      console.error('Error:', error);
      
    }
  };

  const handleVerContrato = () => {
    // Implementar la lógica para ver el PDF
    window.open(_servidorapi + `vercontratopdf/${id}`, '_blank');
  };

  const handleNuevocontrato = () => {
    setShowConfirmContratoModal(true);
  };

  const handleConfirmNuevoContrato = async () => {
    try {
      handleUpdateContratodeshabilitar()
      const response = await fetch(_servidorapi + `obtenerconsecutivo?consecutivo=RHCONTRATOS`);
      if (!response.ok) throw new Error('Error al obtener el consecutivo');
      const data = await response.json();
      const codigo = data.prefijo + '-' + String(data.siguiente).padStart(4, '0');
      // Crear el contrato
      const contratoResponse = await fetch(_servidorapi + 'crearcontratorh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          codigo: codigo,
          id_contratista: id
        }),
      });

      
      if (!contratoResponse.ok) throw new Error('Error al crear el contrato');
      const contratoData = await contratoResponse.json();
      ////
      try {
        setIdContrato(contratoData.id_contrato);
        const response = await fetch(_servidorapi + 'actualizarrhcontratistacontrato', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_contratista: id,
            id_contrato:contratoData.id_contrato
           
          }),
        });
        toast.success('Contrato Creado');
        fetchContrato();
        if (!response.ok) throw new Error('Error al actualizar');
        
       
      } catch (error) {
        console.error('Error:', error);
        toast.error('Error al crear el coontrato');
      } finally {
        //setIsUpdating(false);
      }
      ////


      
      setShowConfirmContratoModal(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al crear el contrato');
    }
  };

  const handleImprimir = () => {
    setShowImprimirModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Avatar */}
        <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden mb-6">
          <div className="flex flex-col items-center py-6">
            <div className="relative w-32 h-32 mb-4">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700">
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <label className="absolute bottom-0 right-0 bg-amber-500 rounded-full p-2 cursor-pointer hover:bg-amber-600 transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <h2 className="mt-2 text-2xl font-bold text-white">{nombrecontratista}</h2>
          </div>
        </div>

        {/* Primera fila de tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Tarjeta 1: Información Seguridad Social */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-6">
            <h3 className="text-lg font-semibold text-amber-500 mb-4">Información Seguridad Social</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">EPS</label>
                <select
                  value={selectedEps}
                  onChange={(e) => setSelectedEps(e.target.value)}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:ring-amber-500 focus:border-amber-500"
                >
                  <option key="default-eps" value="">Seleccione EPS</option>
                  {eps.map((item) => (
                    <option key={`eps-${item.id_fondo}`} value={item.id_fondo}>
                      {item.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Fondo de Pensiones</label>
                <select
                  value={selectedPension}
                  onChange={(e) => setSelectedPension(e.target.value)}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:ring-amber-500 focus:border-amber-500"
                >
                  <option key="default-pension" value="">Seleccione Fondo de Pensiones</option>
                  {pension.map((item) => (
                    <option key={`pension-${item.id_fondo}`} value={item.id_fondo}>
                      {item.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">ARL</label>
                <select
                  value={selectedRiesgo}
                  onChange={(e) => setSelectedRiesgo(e.target.value)}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:ring-amber-500 focus:border-amber-500"
                >
                  <option key="default-riesgo" value="">Seleccione ARL</option>
                  {riesgos.map((item) => (
                    <option key={`riesgo-${item.id_fondo}`} value={item.id_fondo}>
                      {item.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pt-4">
                <button
                  onClick={handleUpdateSeguridadSocial}
                  disabled={isUpdating}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? 'Actualizando...' : 'Actualizar'}
                </button>
              </div>
            </div>
          </div>

          {/* Tarjeta 2: Información Contrato */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-6">
            <h3 className="text-lg font-semibold text-amber-500 mb-4">Información Contrato:: {xcontrato}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">Tipo de Contrato</label>
                <p className="mt-1 text-white">Prestación de Servicios</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Fecha Inicio</label>
                <p className="mt-1 text-white">01/01/2024</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Fecha Fin</label>
                <p className="mt-1 text-white">31/12/2024</p>
              </div>
              <div className="pt-4 flex space-x-3">
                <button
                  onClick={handleNuevocontrato}
                  className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                >
                  Crear
                </button>
                <button
                  onClick={handleImprimir}
                  className="px-4 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                >
                  Imprimir
                </button>
                <button
                  onClick={handleVerContrato}
                  className="px-4 py-1.5 bg-amber-500 text-white text-sm rounded-md hover:bg-amber-600 transition-colors"
                >
                  Ver
                </button>
                <button
                  onClick={() => setShowUpdateContratoModal(true)}
                  className="px-4 py-1.5 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors"
                >
                  Actualizar Contrato
                </button>
              </div>
            </div>
          </div>

          {/* Tarjeta 3: Información Presupuestal */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-6">
            <h3 className="text-lg font-semibold text-amber-500 mb-4">Información Presupuestal</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">Valor Contrato</label>
                <p className="mt-1 text-white">$50,000,000</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">CDP</label>
                <p className="mt-1 text-white">CDP-2024-001</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">RP</label>
                <p className="mt-1 text-white">RP-2024-001</p>
              </div>
            </div>
          </div>
        </div>

        {/* Segunda fila de tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tarjeta 1: Perfil */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-6">
            <h3 className="text-lg font-semibold text-amber-500 mb-4">Perfil</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Profesión</label>
                <select
                  value={selectedProfesion}
                  onChange={(e) => setSelectedProfesion(e.target.value)}
                  className="w-full rounded-md bg-gray-700 border-gray-600 text-white focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">Seleccione Profesión</option>
                  {profesiones.map((item) => (
                    <option key={`profesion-${item.id_profesion}`} value={item.id_profesion}>
                      {item.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Experiencia</label>
                <input
                  type="text"
                  value={experiencia}
                  onChange={(e) => setExperiencia(e.target.value)}
                  className="w-full rounded-md bg-gray-700 border-gray-600 text-white focus:ring-amber-500 focus:border-amber-500 px-4 py-2"
                  placeholder="Describa su experiencia"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Especialización</label>
                <input
                  type="text"
                  value={especializacion}
                  onChange={(e) => setEspecializacion(e.target.value)}
                  className="w-full rounded-md bg-gray-700 border-gray-600 text-white focus:ring-amber-500 focus:border-amber-500 px-4 py-2"
                  placeholder="Describa su especialización"
                />
              </div>
              <div className="pt-4">
                <button
                  onClick={handleUpdatePerfil}
                  disabled={isUpdatingPerfil}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingPerfil ? 'Actualizando...' : 'Actualizar'}
                </button>
              </div>
            </div>
          </div>

          {/* Tarjeta 2: Estudios */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-amber-500">Estudios</h3>
              <button 
                onClick={() => setShowAddEstudioModal(true)}
                className="bg-amber-500 p-2 rounded-full hover:bg-amber-600 transition-colors"
              >
                <PlusIcon className="h-5 w-5 text-white" />
              </button>
            </div>
            <div className="overflow-hidden">
              {estudios.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-300">Título</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-300">Institución</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-300">Año</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-300"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {estudios.map((estudio) => (
                      <tr key={`estudio-${estudio.mi_id}`}>
                        <td className="px-4 py-2 text-sm text-gray-300">{estudio.titulo}</td>
                        <td className="px-4 py-2 text-sm text-gray-300">{estudio.institucion}</td>
                        <td className="px-4 py-2 text-sm text-gray-300">{estudio.ano_fin}</td>
                        <td className="px-4 py-2 text-sm text-gray-300">
                          <button
                            onClick={() => handleDeleteEstudio(estudio.mi_id)}
                            disabled={isDeletingEstudio}
                            className="text-red-400 hover:text-red-500 disabled:opacity-50"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center text-gray-400 py-4">No hay estudios registrados</p>
              )}
            </div>
          </div>

          {/* Tarjeta 3: Actividades */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-amber-500">Actividades</h3>
              <button 
                onClick={() => setShowAddActividadModal(true)}
                className="bg-amber-500 p-2 rounded-full hover:bg-amber-600 transition-colors"
              >
                <PlusIcon className="h-5 w-5 text-white" />
              </button>
            </div>
            <div className="overflow-hidden">
              {actividades.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-300">Actividad</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-300"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {actividades.map((actividad) => (
                      <tr key={`actividad-${actividad.mi_id}`}>
                        <td className="px-4 py-2 text-sm text-gray-300">{actividad.nombre}</td>
                        <td className="px-4 py-2 text-sm text-gray-300 text-right">
                          <button
                            onClick={() => handleDeleteActividad(actividad.mi_id)}
                            disabled={isDeletingActividad}
                            className="text-red-400 hover:text-red-500 disabled:opacity-50"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center text-gray-400 py-4">No hay actividades registradas</p>
              )}
            </div>
          </div>
        </div>

        {/* Botón Volver */}
        <div className="mt-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500"
          >
            Volver
          </button>
        </div>
      </div>

      {/* Modal para agregar estudio */}
      <Transition appear show={showAddEstudioModal} as={Fragment}>
        <Dialog 
          as="div" 
          className="relative z-10" 
          onClose={() => setShowAddEstudioModal(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-amber-500 mb-4"
                  >
                    Agregar Nuevo Estudio
                  </Dialog.Title>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Título
                      </label>
                      <input
                        type="text"
                        value={nuevoEstudio.titulo}
                        onChange={(e) => setNuevoEstudio({...nuevoEstudio, titulo: e.target.value})}
                        className="w-full rounded-md bg-gray-700 border-gray-600 text-white focus:ring-amber-500 focus:border-amber-500 px-4 py-2"
                        placeholder="Ingrese el título"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Institución
                      </label>
                      <input
                        type="text"
                        value={nuevoEstudio.institucion}
                        onChange={(e) => setNuevoEstudio({...nuevoEstudio, institucion: e.target.value})}
                        className="w-full rounded-md bg-gray-700 border-gray-600 text-white focus:ring-amber-500 focus:border-amber-500 px-4 py-2"
                        placeholder="Ingrese la institución"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Año de Terminación
                      </label>
                      <input
                        type="text"
                        value={nuevoEstudio.ano_fin}
                        onChange={(e) => {
                          if (/^\d*$/.test(e.target.value)) {
                            setNuevoEstudio({...nuevoEstudio, ano_fin: e.target.value})
                          }
                        }}
                        className="w-full rounded-md bg-gray-700 border-gray-600 text-white focus:ring-amber-500 focus:border-amber-500 px-4 py-2"
                        placeholder="Ingrese el año (solo números)"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={() => setShowAddEstudioModal(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                      onClick={handleAddEstudio}
                    >
                      Guardar
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Modal para agregar actividad */}
      <Transition appear show={showAddActividadModal} as={Fragment}>
        <Dialog 
          as="div" 
          className="relative z-10" 
          onClose={() => setShowAddActividadModal(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-amber-500 mb-4"
                  >
                    Agregar Nueva Actividad
                  </Dialog.Title>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Descripción de la Actividad
                      </label>
                      <textarea
                        rows="3"
                        value={nuevaActividad.nombre}
                        onChange={(e) => setNuevaActividad({...nuevaActividad, nombre: e.target.value})}
                        className="w-full rounded-md bg-gray-700 border-gray-600 text-white focus:ring-amber-500 focus:border-amber-500 px-4 py-2"
                        placeholder="Describa la actividad"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Workflow
                      </label>
                      <select
                        value={nuevaActividad.id_workflow}
                        onChange={(e) => setNuevaActividad({...nuevaActividad, id_workflow: e.target.value})}
                        className="w-full rounded-md bg-gray-700 border-gray-600 text-white focus:ring-amber-500 focus:border-amber-500"
                      >
                        <option value="">Seleccione Workflow</option>
                        {workflow.map((item) => (
                          <option key={`workflow-${item.id_workflow}`} value={item.id_workflow}>
                            {item.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Días
                        </label>
                        <input
                          type="text"
                          value={nuevaActividad.dias}
                          onChange={(e) => {
                            if (/^\d*$/.test(e.target.value)) {
                              setNuevaActividad({...nuevaActividad, dias: e.target.value})
                            }
                          }}
                          className="w-full rounded-md bg-gray-700 border-gray-600 text-white focus:ring-amber-500 focus:border-amber-500 px-4 py-2"
                          placeholder="Días"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Horas
                        </label>
                        <input
                          type="text"
                          value={nuevaActividad.horas}
                          onChange={(e) => {
                            if (/^\d*$/.test(e.target.value)) {
                              setNuevaActividad({...nuevaActividad, horas: e.target.value})
                            }
                          }}
                          className="w-full rounded-md bg-gray-700 border-gray-600 text-white focus:ring-amber-500 focus:border-amber-500 px-4 py-2"
                          placeholder="Horas"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={() => setShowAddActividadModal(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                      onClick={handleAddActividad}
                    >
                      Guardar
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Modal para actualizar contrato */}
      <Transition appear show={showUpdateContratoModal} as={Fragment}>
        <Dialog 
          as="div" 
          className="relative z-10" 
          onClose={() => setShowUpdateContratoModal(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-amber-500 mb-4"
                  >
                    Actualizar Contrato
                  </Dialog.Title>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Tipo de Contrato
                      </label>
                      <select
                        value={contratoData.id_tipoContrato}
                        onChange={(e) => setContratoData({...contratoData, id_tipoContrato: e.target.value})}
                        className="w-full rounded-md bg-gray-700 border-gray-600 text-white focus:ring-amber-500 focus:border-amber-500"
                      >
                        <option key="default-tipo" value="">Seleccione Tipo de Contrato</option>
                        {tiposContratos.map((tipo) => (
                          <option key={`tipo-${tipo.id_tipoContrato}`} value={tipo.id_tipoContrato}>
                            {tipo.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Objeto del Contrato
                      </label>
                      <textarea
                        rows="3"
                        value={contratoData.objeto}
                        onChange={(e) => setContratoData({...contratoData, objeto: e.target.value})}
                        className="w-full rounded-md bg-gray-700 border-gray-600 text-white focus:ring-amber-500 focus:border-amber-500 px-4 py-2"
                        placeholder="Describa el objeto del contrato"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Fecha Inicio
                        </label>
                        <input
                          type="date"
                          value={contratoData.fecha_inicio}
                          onChange={(e) => setContratoData({...contratoData, fecha_inicio: e.target.value})}
                          className="w-full rounded-md bg-gray-700 border-gray-600 text-white focus:ring-amber-500 focus:border-amber-500 px-4 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Fecha Fin
                        </label>
                        <input
                          type="date"
                          value={contratoData.fecha_fin}
                          onChange={(e) => setContratoData({...contratoData, fecha_fin: e.target.value})}
                          className="w-full rounded-md bg-gray-700 border-gray-600 text-white focus:ring-amber-500 focus:border-amber-500 px-4 py-2"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Valor
                        </label>
                        <input
                          type="text"
                          value={contratoData.valor}
                          onChange={(e) => {
                            if (/^\d*$/.test(e.target.value)) {
                              setContratoData({...contratoData, valor: e.target.value})
                            }
                          }}
                          className="w-full rounded-md bg-gray-700 border-gray-600 text-white focus:ring-amber-500 focus:border-amber-500 px-4 py-2"
                          placeholder="Valor del contrato"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Compromiso
                        </label>
                        <select
                          value={contratoData.id_compromiso}
                          onChange={(e) => setContratoData({...contratoData, id_compromiso: e.target.value})}
                          className="w-full rounded-md bg-gray-700 border-gray-600 text-white focus:ring-amber-500 focus:border-amber-500"
                        >
                          <option key="default-compromiso" value="">Seleccione Compromiso</option>
                          {compromisos.map((compromiso) => (
                            <option key={`compromiso-${compromiso.id_registro}`} value={compromiso.id_registro}>
                              {compromiso.codigo}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                       Rol
                      </label>
                      <select
                        value={contratoData.id_perfil}
                        onChange={(e) => setContratoData({...contratoData, id_perfil: e.target.value})}
                        className="w-full rounded-md bg-gray-700 border-gray-600 text-white focus:ring-amber-500 focus:border-amber-500"
                      >
                        <option key="default-organigrama" value="">Seleccione un Rol</option>
                        {organigrama.map((item) => (
                          <option key={`organigrama-${item.id_perfil}`} value={item.id_perfil}>
                            {item.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={() => setShowUpdateContratoModal(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                      onClick={handleUpdateContrato}
                    >
                      Guardar
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Modal de confirmación para nuevo contrato */}
      <Transition appear show={showConfirmContratoModal} as={Fragment}>
        <Dialog 
          as="div" 
          className="relative z-10" 
          onClose={() => setShowConfirmContratoModal(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-amber-500 mb-4"
                  >
                    Confirmar Nuevo Contrato
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-300">
                      ¿Está seguro que desea crear un nuevo contrato para este contratista?
                    </p>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={() => setShowConfirmContratoModal(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                      onClick={handleConfirmNuevoContrato}
                    >
                      Confirmar
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Modal para Imprimir Contrato */}
      <Transition appear show={showImprimirModal} as={Fragment}>
        <Dialog 
          as="div" 
          className="relative z-10" 
          onClose={() => setShowImprimirModal(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-amber-500 mb-4"
                  >
                    Imprimir Contrato
                  </Dialog.Title>
                  <div className="mt-2">
                    <Contratoimpresion idcontrato={id_contrato} />
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={() => setShowImprimirModal(false)}
                    >
                      Cerrar
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
} 