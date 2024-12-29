async function findCyclesPassingThroughNodes(graphObjects, startNode, endNode) {
    //console.log(graphObjects, startNode, endNode, typeof startNode);
    const path = [];
    const cycles = [];

    function convertToAdjacencyList(graphObjects) {
        const adjacencyList = {};

        const { nodes, links } = graphObjects;

        // Duyệt qua từng liên kết (links) để xây dựng danh sách kề
        if (links) {
            links.forEach(({ source, target }) => {
                if (!adjacencyList[source]) {
                    adjacencyList[source] = [];
                }
                adjacencyList[source].push(target);
            });
        }

        // Loại bỏ trùng lặp trong danh sách kề
        for (const node in adjacencyList) {
            adjacencyList[node] = [...new Set(adjacencyList[node])];
        }

        return adjacencyList;
    }

    function dfs(graph, node, hasPassedEndNode = false) {
        if (path.length > 0 && node === startNode && hasPassedEndNode) {
            // Phát hiện chu trình bắt đầu từ startNode, đi qua endNode, và quay lại startNode
            cycles.push([...path, startNode]);
            return;
        }

        if (path.includes(node)) return; // Tránh quay lại các đỉnh đã duyệt trên đường đi hiện tại

        path.push(node);

        if (graph[node]) {
            for (const neighbor of graph[node]) {
                dfs(graph, neighbor, hasPassedEndNode || node === endNode);
            }
        }

        path.pop(); // Backtrack
    }

    const graph = convertToAdjacencyList(graphObjects);
    //console.log("Danh sách kề:", graph);

    await dfs(graph, startNode);
    //console.log("Chu trình tìm được:", cycles);
    return cycles;
}

export default findCyclesPassingThroughNodes;
