import React, { useState, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  ReactFlowProvider,
  useReactFlow,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Initial nodes and edges
const initialNodes = [
  {
    id: '0',
    type: 'input',
    data: { label: 'Node' },
    position: { x: 0, y: 50 },
  },
];
const initialEdges = [];

let id = 1;
const getId = () => `node_${Date.now()}`;

const MindMap = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { screenToFlowPosition } = useReactFlow();

  // Handle new connection (edge)
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  // Handle double click to add a new node
  const onDoubleClick = useCallback(
    (event) => {
      const { clientX, clientY } = event;
      const position = screenToFlowPosition({ x: clientX, y: clientY });
      const newNode = {
        id: getId(),
        data: { label: `Node ${id}` },
        position: position,
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [screenToFlowPosition]
  );

  // Handle the end of edge connection (on invalid drop)
  const onConnectEnd = useCallback(
    (event, connectionState) => {
      if (!connectionState.isValid) {
        const { clientX, clientY } =
          'changedTouches' in event ? event.changedTouches[0] : event;
        const position = screenToFlowPosition({ x: clientX, y: clientY });
        const newId = getId();
        const newNode = {
          id: newId,
          position: position,
          data: { label: `Node ${newId}` },
        };
        setNodes((nds) => [...nds, newNode]);
        setEdges((eds) =>
          eds.concat({
            id: newId,
            source: connectionState.fromNode.id,
            target: newId,
          })
        );
      } else {
        setEdges((eds) => addEdge(connectionState, eds));
      }
    },
    [screenToFlowPosition]
  );

  return (
    <>
      <Helmet>
        <title>MindMaps | Actionote</title>
        <meta
          name="description"
          content="Build amazing roadmaps and mindmap using Actionote's MindMaps feature"
        />
      </Helmet>
      <div
        ref={reactFlowWrapper}
        className="w-full h-screen"
        onDoubleClick={onDoubleClick}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onConnectEnd={onConnectEnd} // Handle drop of new node on edge
          fitView
        >
          <MiniMap nodeColor={() => 'blue'} />
          <Controls />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </div>
    </>
  );
};

export default function App() {
  return (
    <ReactFlowProvider>
      <MindMap />
    </ReactFlowProvider>
  );
}
