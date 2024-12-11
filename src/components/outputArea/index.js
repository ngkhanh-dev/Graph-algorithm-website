import "./output.css";
import React, { useEffect, useState, useContext, useRef, memo } from "react";
import { GraphCanvas } from "reagraph";
import { DataContext } from "../../App";

function Graph3D() {
    const { sharedData } = useContext(DataContext);

    const [graph, setGraph] = useState({
        nodes: [
            {
                id: "1",
                label: "1",
            },
            {
                id: "2",
                label: "2",
            },
        ],
        links: [
            {
                id: "1-2",
                source: "1",
                target: "2",
                label: "1",
            },
        ],
        direct: "none",
    });

    // useEffect(() => {
    //     fetch("http://localhost:3005/api/v1/graphs")
    //         .then((res) => res.json())
    //         .then((data) => {
    //             const res = data.graph[0];
    //             //console.log(data.graph[0]);
    //             if (res) {
    //                 res.nodes = res.nodes.map((item) => {
    //                     return {
    //                         id: `${item.id}`,
    //                         label: `${item.id}`,
    //                     };
    //                 });
    //                 res.links = res.links.map((item) => {
    //                     return {
    //                         id: `${item.source}-${item.target}`,
    //                         source: `${item.source}`,
    //                         target: `${item.target}`,
    //                         label: `${item.source}-${item.target}`,
    //                     };
    //                 });
    //             }
    //             console.log(res);
    //             setGraph(res);
    //         })
    //         .catch((e) => {
    //             console.log(e);
    //             <h1>Fetch thất bại</h1>;
    //         });
    // }, []);

    // const res = useRef({ nodes: [], links: [], direct: "" });

    useEffect(() => {
        if (sharedData) {
            const newGraph = {
                nodes:
                    sharedData?.nodes?.map((item) => ({
                        id: `${item.id}`,
                        label: `${item.id}`,
                    })) || [],
                links:
                    sharedData?.links?.map((item) => ({
                        id: `${item.source}-${item.target}`,
                        source: `${item.source}`,
                        target: `${item.target}`,
                        label: `${item.weight}`,
                        size: parseInt(`${item.weight}`),
                    })) || [],
                direct: sharedData?.direct || "none",
            };
            // res.nodes = sharedData?.graph?.nodes?.map((item) => {
            //     return {
            //         id: `${item.id}`,
            //         label: `${item.id}`,
            //     };
            // });
            // res.links = sharedData?.graph?.links?.map((item) => {
            //     return {
            //         id: `${item.source}-${item.target}`,
            //         source: `${item.source}`,
            //         target: `${item.target}`,
            //         label: `${item.source}-${item.target}`,
            //         size: parseInt(`${item.weight}`),
            //     };
            // });
            // res.direct = sharedData?.graph?.direct;
            // console.log(newGraph);
            setGraph(newGraph);
        }
    }, [sharedData]);

    return (
        <div className="show-container">
            <GraphCanvas
                className="graph-canvas"
                edgeArrowPosition={graph.direct === "direct" ? "end" : "none"}
                labelType="all"
                nodes={
                    graph?.nodes
                        ? graph.nodes.map((node) => ({ ...node, key: node.id }))
                        : []
                }
                edges={
                    graph?.links
                        ? graph.links.map((link) => ({ ...link, key: link.id }))
                        : []
                }
                draggable
                renderNode={({ size, color, opacity }) => (
                    <group>
                        <mesh>
                            <torusKnotGeometry
                                attach="geometry"
                                args={[4, 1.25, 200, 8]}
                            />
                            <meshBasicMaterial
                                attach="material"
                                color={color}
                                opacity={opacity}
                                transparent
                            />
                        </mesh>
                    </group>
                )}
            />
        </div>
    );
}

export default memo(Graph3D);
