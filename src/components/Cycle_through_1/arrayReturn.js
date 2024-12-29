async function findCyclesPassingThroughAtNode(graphObjects, targetNode) {
    //console.log(graphObjects, targetNode);
    const path = [];
    const cycles = [];

    // Chuyển đồ thị thành danh sách kề
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

    // Hàm DFS để tìm chu trình
    function dfs(graph, node, hasPassedTargetNode = false) {
        if (path.length > 0 && node === path[0] && hasPassedTargetNode) {
            // Phát hiện chu trình bắt đầu và kết thúc tại node đầu tiên và đi qua targetNode
            cycles.push([...path, path[0]]);
            return;
        }

        if (path.includes(node)) return; // Tránh quay lại các đỉnh đã duyệt

        path.push(node);

        if (graph[node]) {
            for (const neighbor of graph[node]) {
                // Nếu chưa đi qua targetNode, tiếp tục tìm kiếm
                dfs(
                    graph,
                    neighbor,
                    hasPassedTargetNode || node === targetNode
                );
            }
        }

        path.pop(); // Backtrack
    }

    const graph = convertToAdjacencyList(graphObjects);
    //console.log("Danh sách kề:", graph);

    await dfs(graph, targetNode);
    //console.log("Chu trình tìm được:", cycles);
    return cycles;
}

export default findCyclesPassingThroughAtNode;
