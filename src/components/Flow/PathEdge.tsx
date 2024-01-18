import React from "react";
import { BaseEdge, Edge, EdgeProps, getBezierPath } from "reactflow";

// export type PathEdgeType = Edge;

const PathEdge = (props: EdgeProps) => {
  const { id, sourceX, sourceY, targetX, targetY } = props;
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
    </>
  );
};

export default PathEdge;
