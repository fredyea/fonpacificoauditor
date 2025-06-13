'use client';

import { useEffect, useState, memo } from 'react';
import { useSearchParams } from 'next/navigation';
import { use } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position,
  getBezierPath
} from 'reactflow';
import 'reactflow/dist/style.css';

// Componente de nodo condicional personalizado
const ConditionalNode = memo(({ data }) => {
  return (
    <>
      <Handle type="target" position={Position.Top} id="input" />
      <Handle type="source" position={Position.Left} id="yes" />
      <Handle type="source" position={Position.Right} id="no" />
      <div
        style={{
          background: '#FFA726',
          border: '1px solid #F57C00',
          padding: '10px',
          borderRadius: '2px',
          width: '150px',
          height: '150px',
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{
          color: 'white',
          textAlign: 'center',
          padding: '10px',
          maxWidth: '90%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {data.label}
        </div>
      </div>
    </>
  );
});

ConditionalNode.displayName = 'ConditionalNode';

// Componente de nodo normal personalizado
const NormalNode = memo(({ data }) => {
  return (
    <>
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="target" position={Position.Left} id="left" />
      <Handle type="target" position={Position.Right} id="right" />
      <Handle type="target" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <div
        style={{
          background: '#2196F3',
          color: 'white',
          border: '1px solid #1565C0',
          padding: '10px',
          borderRadius: '4px',
          width: '150px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{
          textAlign: 'center',
          padding: '10px',
          maxWidth: '90%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {data.label}
        </div>
      </div>
    </>
  );
});

NormalNode.displayName = 'NormalNode';

// Tipos de nodos disponibles
const nodeTypes = {
  conditional: ConditionalNode,
  normal: NormalNode,
};

const initialNodes = [
  {
    id: 'start',
    type: 'input',
    data: { label: 'Inicio' },
    position: { x: 250, y: 0 },
    style: {
      background: '#4CAF50',
      color: 'white',
      border: '1px solid #2E7D32',
      width: 150,
    },
  },
];

const _servidorapi = `${process.env.NEXT_PUBLIC_API_URL}/`;

export default function WorkflowConfig({ params }) {
  const searchParams = useSearchParams();
  const workflowName = searchParams.get('nombre');
  const workflowId = use(params).id;
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [showNodeModal, setShowNodeModal] = useState(false);
  const [showEdgeModal, setShowEdgeModal] = useState(false);
  const [nodeFormData, setNodeFormData] = useState({
    title: '',
    description: '',
    assignee: '',
    isConditional: false,
    conditions: {
      yesPath: '',
      noPath: ''
    }
  });
  const [edgeFormData, setEdgeFormData] = useState({
    label: ''
  });

  // Cargar workflow al montar el componente
  useEffect(() => {
    const fetchWorkflow = async () => {
      const res = await fetch(`${_servidorapi}workflow/${workflowId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.nodes && data.edges) {
          setNodes(data.nodes);
          setEdges(data.edges);
        }
      }
    };
    fetchWorkflow();
  }, [workflowId]);

  const onConnect = (params) => {
    const sourceNode = nodes.find(node => node.id === params.source);
    const isFromConditional = sourceNode?.type === 'conditional';

    // Detectar si la conexión es lateral (left/right a left/right)
    const isLateral =
      (params.sourceHandle === 'left' || params.sourceHandle === 'right') &&
      (params.targetHandle === 'left' || params.targetHandle === 'right');

    const newEdge = {
      ...params,
      type: isLateral ? 'step' : 'straight',
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#888' },
      sourceHandle: params.sourceHandle,
      targetHandle: params.targetHandle
    };

    if (isFromConditional) {
      if (params.sourceHandle === 'yes') {
        newEdge.label = 'SI';
      } else if (params.sourceHandle === 'no') {
        newEdge.label = 'NO';
      }
    }

    setEdges((eds) => addEdge(newEdge, eds));
  };

  const onNodeClick = (event, node) => {
    setSelectedNode(node);
    setShowNodeModal(true);
    if (node.data.taskDetails) {
      setNodeFormData(node.data.taskDetails);
    } else {
      setNodeFormData({
        title: node.data.label,
        description: '',
        assignee: '',
        isConditional: false,
        conditions: {
          yesPath: '',
          noPath: ''
        }
      });
    }
  };

  const onEdgeClick = (event, edge) => {
    setSelectedEdge(edge);
    setShowEdgeModal(true);
    setEdgeFormData({
      label: edge.label || ''
    });
  };

  const addNewTask = () => {
    const newNode = {
      id: `task-${nodes.length + 1}`,
      type: 'normal',
      data: { 
        label: 'Nueva Tarea',
        taskDetails: {
          title: 'Nueva Tarea',
          description: '',
          assignee: '',
          isConditional: false,
          conditions: {
            yesPath: '',
            noPath: ''
          }
        }
      },
      position: { 
        x: Math.random() * 500, 
        y: Math.random() * 500 
      }
    };
    setNodes((nds) => [...nds, newNode]);
  };

  // Botón para guardar el workflow
  const handleSave = async () => {
    // Filtrar solo los campos necesarios para nodos y edges
    const filteredNodes = nodes.map(n => ({
      id: n.id,
      type: n.type,
      data: n.data,
      position: n.position
    }));
    const filteredEdges = edges.map(e => ({
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle,
      targetHandle: e.targetHandle,
      label: e.label,
      data: e.data,
      style: e.style,
      type: e.type
    }));
    const workflow_id = workflowId;
    const workflow_name = workflowName || 'Workflow sin nombre';
    const response = await fetch(`${_servidorapi}workflow/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workflow_id, workflow_name, nodes: filteredNodes, edges: filteredEdges })
    });
    if (response.ok) {
      alert('¡Workflow guardado exitosamente!');
    } else {
      alert('Error al guardar el workflow');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <div className="flex justify-between items-center p-4 bg-gray-800">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Configuración de Workflow: {workflowName}
          </h1>
          <p className="text-gray-400">ID: {workflowId}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={addNewTask}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Agregar Tarea
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
      
      <div className="flex-1 w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>

      {showNodeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Configurar Tarea</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={nodeFormData.title}
                  onChange={(e) => setNodeFormData({...nodeFormData, title: e.target.value})}
                  className="w-full bg-gray-700 border-gray-600 rounded-md text-white px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Descripción
                </label>
                <textarea
                  value={nodeFormData.description}
                  onChange={(e) => setNodeFormData({...nodeFormData, description: e.target.value})}
                  className="w-full bg-gray-700 border-gray-600 rounded-md text-white px-3 py-2"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Responsable
                </label>
                <input
                  type="text"
                  value={nodeFormData.assignee}
                  onChange={(e) => setNodeFormData({...nodeFormData, assignee: e.target.value})}
                  className="w-full bg-gray-700 border-gray-600 rounded-md text-white px-3 py-2"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isConditional"
                  checked={nodeFormData.isConditional}
                  onChange={(e) => setNodeFormData({...nodeFormData, isConditional: e.target.checked})}
                  className="h-4 w-4 bg-gray-700 border-gray-600 rounded"
                />
                <label htmlFor="isConditional" className="ml-2 text-sm font-medium text-gray-300">
                  Es tarea condicional
                </label>
              </div>
              {nodeFormData.isConditional && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Camino SI (descripción)
                    </label>
                    <input
                      type="text"
                      value={nodeFormData.conditions.yesPath}
                      onChange={(e) => setNodeFormData({
                        ...nodeFormData,
                        conditions: {
                          ...nodeFormData.conditions,
                          yesPath: e.target.value
                        }
                      })}
                      className="w-full bg-gray-700 border-gray-600 rounded-md text-white px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Camino NO (descripción)
                    </label>
                    <input
                      type="text"
                      value={nodeFormData.conditions.noPath}
                      onChange={(e) => setNodeFormData({
                        ...nodeFormData,
                        conditions: {
                          ...nodeFormData.conditions,
                          noPath: e.target.value
                        }
                      })}
                      className="w-full bg-gray-700 border-gray-600 rounded-md text-white px-3 py-2"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => {
                  if (selectedNode) {
                    setNodes((nds) =>
                      nds.map((node) => {
                        if (node.id === selectedNode.id) {
                          const updatedNode = {
                            ...node,
                            type: nodeFormData.isConditional ? 'conditional' : 'normal',
                            data: {
                              ...node.data,
                              label: nodeFormData.title,
                              taskDetails: nodeFormData,
                            }
                          };
                          return updatedNode;
                        }
                        return node;
                      })
                    );
                  }
                  setShowNodeModal(false);
                }}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Guardar
              </button>
              <button
                onClick={() => setShowNodeModal(false)}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showEdgeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Configurar Conexión</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Etiqueta
                </label>
                <input
                  type="text"
                  value={edgeFormData.label}
                  onChange={(e) => setEdgeFormData({...edgeFormData, label: e.target.value})}
                  className="w-full bg-gray-700 border-gray-600 rounded-md text-white px-3 py-2"
                />
              </div>
            </div>
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => {
                  if (selectedEdge) {
                    setEdges((eds) =>
                      eds.map((edge) => {
                        if (edge.id === selectedEdge.id) {
                          return {
                            ...edge,
                            label: edgeFormData.label
                          };
                        }
                        return edge;
                      })
                    );
                  }
                  setShowEdgeModal(false);
                }}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Guardar
              </button>
              <button
                onClick={() => setShowEdgeModal(false)}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 