'use client';

import { useState, useEffect } from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import { ExclamationTriangleIcon, PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useUser } from '../../../context/UserContext';

// Asegurarnos de que la URL de la API esté correctamente formada
const _servidorapi = process.env.NEXT_PUBLIC_API_URL ? 
  (process.env.NEXT_PUBLIC_API_URL.endsWith('/') ? process.env.NEXT_PUBLIC_API_URL : `${process.env.NEXT_PUBLIC_API_URL}/`) : 
  '/api/';

console.log('URL base de la API:', _servidorapi);

const NodeComponent = ({ node, onAdd, onEdit, onDelete }) => {
  return (
    <div className="p-4 border-2 border-amber-600 rounded-lg bg-gray-800 text-white min-w-[200px]">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold">{node.title}</h3>
          <p className="text-sm text-gray-300">{node.name}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onAdd(node.id)}
            className="p-1 hover:bg-amber-600 rounded"
            title="Agregar subordinado"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEdit(node)}
            className="p-1 hover:bg-amber-600 rounded"
            title="Editar"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          {!node.isRoot && (
            <button
              onClick={() => onDelete(node.id)}
              className="p-1 hover:bg-red-600 rounded"
              title="Eliminar"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-white">{title}</h2>
        {children}
      </div>
    </div>
  );
};

const renderOrgNode = (node, onAdd, onEdit, onDelete) => {
  return (
    <TreeNode
      key={node.id}
      label={
        <NodeComponent
          node={node}
          onAdd={onAdd}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      }
    >
      {node.children?.map((child) =>
        renderOrgNode(child, onAdd, onEdit, onDelete)
      )}
    </TreeNode>
  );
};

// Componente para iniciar el organigrama
const InitializeOrgChart = ({ onInitialize }) => {
  const [formData, setFormData] = useState({
    title: 'Gerente General',
    name: ''
  });

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-xl font-bold text-white mb-4">Iniciar Organigrama</h2>
      <p className="text-gray-300 mb-4">
        No hay un organigrama configurado. Para comenzar, ingrese los datos del cargo principal.
      </p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Cargo
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Nombre del Ocupante
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            placeholder="Ingrese el nombre de la persona"
          />
        </div>
        <button
          onClick={() => onInitialize(formData)}
          className="w-full px-4 py-2 bg-amber-600 text-white hover:bg-amber-700 rounded font-medium"
        >
          Crear Organigrama
        </button>
      </div>
    </div>
  );
};

export default function Organigrama() {
  const [orgData, setOrgData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedNode, setSelectedNode] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    name: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userData } = useUser();

  // Función para manejar la respuesta de la API
  const handleApiResponse = async (response) => {
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error('Respuesta no JSON:', await response.text());
      throw new Error('La respuesta del servidor no es JSON válido');
    }
    return response.json();
  };

  // Cargar datos del organigrama
  useEffect(() => {
    const fetchOrgData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${_servidorapi}organigrama`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userData?.token || ''}`,
            'x-empresa-id': userData?.empresa_id || '1'
          },
        });

        if (!response.ok) {
          throw new Error('Error al cargar el organigrama');
        }

        const data = await response.json();
        setOrgData(data);
      } catch (err) {
        console.error('Error al cargar:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (userData) {
      fetchOrgData();
    } else {
      setIsLoading(false);
    }
  }, [userData]);

  const handleInitialize = async (initialData) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${_servidorapi}organigrama`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData?.token || ''}`,
          'x-empresa-id': userData?.empresa_id || '1'
        },
        body: JSON.stringify({
          title: initialData.title,
          name: initialData.name,
          isRoot: true
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear el organigrama');
      }

      const data = await response.json();
      setOrgData(data);
    } catch (err) {
      console.error('Error al inicializar:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = (parentId) => {
    setModalMode('add');
    setSelectedNode(parentId);
    setFormData({ title: '', name: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (node) => {
    setModalMode('edit');
    setSelectedNode(node);
    setFormData({ title: node.title, name: node.name });
    setIsModalOpen(true);
  };

  const handleDelete = async (nodeId) => {
    if (!confirm('¿Está seguro de que desea eliminar este cargo y todos sus subordinados?')) {
      return;
    }

    try {
      const response = await fetch(`${_servidorapi}organigrama`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData?.token}`
        },
        body: JSON.stringify({ id: nodeId }),
      });

      if (!response.ok) throw new Error('Error al eliminar el nodo');

      // Actualizar el estado local
      const deleteNode = (nodes) => {
        return nodes.filter((node) => {
          if (node.id === nodeId) return false;
          if (node.children) {
            node.children = deleteNode(node.children);
          }
          return true;
        });
      };

      const updateTree = (node) => {
        if (node.id === nodeId) return null;
        if (node.children) {
          node.children = node.children
            .map(updateTree)
            .filter(Boolean);
        }
        return { ...node };
      };

      setOrgData(prev => prev ? updateTree(prev) : null);
    } catch (err) {
      console.error('Error al eliminar:', err);
      alert('Error al eliminar el cargo');
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${_servidorapi}organigrama`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData?.token}`
        },
        body: JSON.stringify({
          id: modalMode === 'edit' ? selectedNode.id : undefined,
          title: formData.title,
          name: formData.name,
          parentId: modalMode === 'add' ? selectedNode : undefined,
          empresa_id: userData?.empresa_id || 1,
        }),
      });

      if (!response.ok) throw new Error('Error al guardar');
      
      const result = await response.json();

      if (modalMode === 'add') {
        // Actualizar el árbol para el nuevo nodo
        const addNode = (node) => {
          if (node.id === selectedNode) {
            const newNode = {
              id: result.id,
              title: formData.title,
              name: formData.name,
              children: [],
            };
            node.children = [...(node.children || []), newNode];
            return { ...node };
          }
          if (node.children) {
            return {
              ...node,
              children: node.children.map(addNode),
            };
          }
          return node;
        };

        setOrgData(prev => prev ? addNode(prev) : null);
      } else {
        // Actualizar el árbol para el nodo editado
        const editNode = (node) => {
          if (node.id === selectedNode.id) {
            return {
              ...node,
              title: formData.title,
              name: formData.name,
            };
          }
          if (node.children) {
            return {
              ...node,
              children: node.children.map(editNode),
            };
          }
          return node;
        };

        setOrgData(prev => prev ? editNode(prev) : null);
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error('Error al guardar:', err);
      alert('Error al guardar los cambios');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Cargando organigrama...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white bg-red-600 p-4 rounded-lg flex items-center">
          <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
          <div>
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!orgData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <InitializeOrgChart onInitialize={handleInitialize} />
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-gray-900">
      <h1 className="text-3xl font-bold mb-8 text-white">Organigrama FONPACIFICO</h1>
      
      <div className="overflow-auto">
        <div className="min-w-[800px] p-4">
          <Tree
            lineWidth="2px"
            lineColor="#d97706"
            lineBorderRadius="10px"
            label={
              <NodeComponent
                node={orgData}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            }
          >
            {orgData.children?.map((node) =>
              renderOrgNode(node, handleAdd, handleEdit, handleDelete)
            )}
          </Tree>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'add' ? 'Agregar Cargo' : 'Editar Cargo'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Cargo
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Nombre
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-white hover:bg-gray-700 rounded"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-amber-600 text-white hover:bg-amber-700 rounded"
            >
              {modalMode === 'add' ? 'Agregar' : 'Guardar'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
} 