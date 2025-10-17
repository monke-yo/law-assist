"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Position,
  BaseEdge,
  getSmoothStepPath,
  EdgeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// Custom animated edge component
function AnimatedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: EdgeProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <circle r="4" fill="#3b82f6" className="animate-pulse">
        <animateMotion dur="3s" repeatCount="indefinite" path={edgePath} />
      </circle>
    </>
  );
}

// Custom node component with checkbox
function WorkflowNode({ data }: { data: any }) {
  const [isCompleted, setIsCompleted] = useState(data.completed || false);

  const handleToggle = () => {
    setIsCompleted(!isCompleted);
    if (data.onToggle) {
      data.onToggle(data.id, !isCompleted);
    }
  };

  return (
    <div
      className={`px-4 py-3 shadow-lg rounded-lg border-2 transition-all duration-300 ${
        isCompleted
          ? "bg-green-100 border-green-500 text-green-800"
          : "bg-white border-gray-300 text-gray-800"
      }`}
    >
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={handleToggle}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
        <div>
          <div className="font-semibold text-sm">{data.title}</div>
          <div className="text-xs opacity-75">{data.description}</div>
        </div>
      </div>
      {isCompleted && (
        <div className="mt-2 text-xs text-green-600">✓ Completed</div>
      )}
    </div>
  );
}

interface WorkflowDiagramProps {
  processType?: string;
}

const nodeTypes = {
  workflow: WorkflowNode,
};

const edgeTypes = {
  animated: AnimatedEdge,
};

export default function WorkflowDiagram({
  processType = "general",
}: WorkflowDiagramProps) {
  // Define different workflow processes
  const workflows = {
    general: {
      title: "General Legal Process",
      steps: [
        {
          id: "1",
          title: "Initial Consultation",
          description: "Meet with attorney",
          position: { x: 50, y: 400 },
        },
        {
          id: "2",
          title: "Case Assessment",
          description: "Evaluate legal options",
          position: { x: 200, y: 320 },
        },
        {
          id: "3",
          title: "Document Preparation",
          description: "Gather required documents",
          position: { x: 350, y: 240 },
        },
        {
          id: "4",
          title: "Filing/Submission",
          description: "Submit to court/authority",
          position: { x: 500, y: 160 },
        },
        {
          id: "5",
          title: "Resolution",
          description: "Complete legal process",
          position: { x: 650, y: 80 },
        },
      ],
    },
    divorce: {
      title: "Divorce Process",
      steps: [
        {
          id: "1",
          title: "File Petition",
          description: "Submit divorce papers",
          position: { x: 50, y: 400 },
        },
        {
          id: "2",
          title: "Serve Spouse",
          description: "Legal notification",
          position: { x: 200, y: 320 },
        },
        {
          id: "3",
          title: "Response Period",
          description: "Wait for spouse response",
          position: { x: 350, y: 240 },
        },
        {
          id: "4",
          title: "Discovery/Negotiation",
          description: "Asset division discussion",
          position: { x: 500, y: 160 },
        },
        {
          id: "5",
          title: "Final Decree",
          description: "Court approval",
          position: { x: 650, y: 80 },
        },
      ],
    },
    contract: {
      title: "Contract Dispute Process",
      steps: [
        {
          id: "1",
          title: "Review Contract",
          description: "Analyze terms & breach",
          position: { x: 50, y: 400 },
        },
        {
          id: "2",
          title: "Demand Letter",
          description: "Formal notice to other party",
          position: { x: 200, y: 320 },
        },
        {
          id: "3",
          title: "Mediation",
          description: "Attempt to resolve",
          position: { x: 350, y: 240 },
        },
        {
          id: "4",
          title: "Litigation",
          description: "File lawsuit if needed",
          position: { x: 500, y: 160 },
        },
        {
          id: "5",
          title: "Judgment/Settlement",
          description: "Final resolution",
          position: { x: 650, y: 80 },
        },
      ],
    },
  };

  const currentWorkflow =
    workflows[processType as keyof typeof workflows] || workflows.general;

  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const handleStepToggle = useCallback((stepId: string, completed: boolean) => {
    setCompletedSteps((prev) => {
      const newSet = new Set(prev);
      if (completed) {
        newSet.add(stepId);
      } else {
        newSet.delete(stepId);
      }
      return newSet;
    });
  }, []);

  const initialNodes: Node[] = useMemo(
    () =>
      currentWorkflow.steps.map((step, index) => ({
        id: step.id,
        type: "workflow",
        position: step.position,
        data: {
          id: step.id,
          title: step.title,
          description: step.description,
          completed: completedSteps.has(step.id),
          onToggle: handleStepToggle,
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      })),
    [currentWorkflow.steps, completedSteps, handleStepToggle]
  );

  const initialEdges: Edge[] = useMemo(
    () =>
      currentWorkflow.steps.slice(0, -1).map((step, index) => ({
        id: `e${step.id}-${currentWorkflow.steps[index + 1].id}`,
        source: step.id,
        target: currentWorkflow.steps[index + 1].id,
        type: "animated",
        animated: true,
        style: { stroke: "#3b82f6", strokeWidth: 2 },
      })),
    [currentWorkflow.steps]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes when completedSteps changes
  React.useEffect(() => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          completed: completedSteps.has(node.id),
        },
      }))
    );
  }, [completedSteps, setNodes]);

  const progressPercentage =
    (completedSteps.size / currentWorkflow.steps.length) * 100;

  return (
    <div className="border-2 border-gray-300 rounded-lg bg-gray-50 p-4 mt-4">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800">
          {currentWorkflow.title}
        </h3>
        <div className="flex items-center space-x-2 mt-2">
          <div className="text-sm text-gray-600">Progress:</div>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="text-sm font-semibold text-gray-700">
            {completedSteps.size}/{currentWorkflow.steps.length}
          </div>
        </div>
      </div>

      <div style={{ height: "500px", width: "100%" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
        >
          <Background color="#f3f4f6" gap={20} />
          <Controls />
        </ReactFlow>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        💡 Click the checkboxes to mark steps as completed. The animated dots
        show the flow progression.
      </div>
    </div>
  );
}
