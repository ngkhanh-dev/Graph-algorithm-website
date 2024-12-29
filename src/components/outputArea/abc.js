import "./output.css";
import React, { useEffect, useState, useContext, useRef, memo } from "react";

import { DataContext } from "../../App";
import { Network } from "vis-network/peer";
import "vis-network/styles/vis-network.css";

const Graph = () => {
    const networkRef = useRef(null);
    const prevGraphRef = useRef(null); // Lưu trữ dữ liệu graph trước đó
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
                from: "1",
                to: "2",
                label: "1",
            },
        ],
        direct: "none",
    });

    useEffect(() => {
        if (sharedData) {
            console.log(sharedData);
            const newGraph = {
                nodes:
                    sharedData?.nodes?.map((item) => ({
                        id: `${item.id}`,
                        label: `${item.id}`,
                    })) || [],
                links:
                    sharedData?.links?.map((item) => ({
                        id: `${item.source}-${item.target}`,
                        from: `${item.source}`,
                        to: `${item.target}`,
                        label: `${item.weight}`,
                        mark: `${item.mark}` || 0,
                        color: { color: item.mark === "1" ? "red" : "black" },
                        size: parseFloat(`${item.weight}`),
                    })) || [],
                direct: sharedData?.direct || "none",
            };

            setGraph(newGraph);

            // Dữ liệu cho node và cạnh
            const nodes = graph.nodes;

            const edges = graph.links;

            // Cấu hình cho mạng
            const data = {
                nodes,
                edges,
            };

            const options = {
                nodes: {
                    shape: "dot",
                    size: 20,
                },
                edges: {
                    width: 2,
                    smooth: { type: "continuous" },
                    arrows: {
                        to: {
                            enabled: true,
                            scaleFactor: 1, // Tỷ lệ kích thước mũi tên
                        },
                    },
                },
                physics: {
                    enabled: true, // Disable physics để mạng không di chuyển
                },
            };

            // Khởi tạo mạng
            new Network(networkRef.current, data, options);
        }
    }, [sharedData]);

    return (
        // <div
        //     ref={networkRef}
        //     style={{
        //         width: "600px",
        //         height: "400px",
        //         border: "1px solid lightgray",
        //     }}
        // ></div>
        <div ref={networkRef} className="show-container"></div>
    );
};

export default memo(Graph);
