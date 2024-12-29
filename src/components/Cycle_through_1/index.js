function Cycle_through_1(graphObjects, startNode) {
    function convertToAdjacencyList(graphObjects) {
        const adjacencyList = {};

        graphObjects.forEach((graph) => {
            const { links } = graph;

            // Duyệt qua từng liên kết (links) để xây dựng danh sách kề
            links.forEach(({ source, target }) => {
                if (!adjacencyList[source]) {
                    adjacencyList[source] = [];
                }
                adjacencyList[source].push(target);
            });
        });

        // Loại bỏ trùng lặp trong danh sách kề
        for (const node in adjacencyList) {
            adjacencyList[node] = [...new Set(adjacencyList[node])];
        }

        return adjacencyList;
    }

    function findCyclesStartingAtNode(graph, startNode) {
        const path = [];
        const cycles = [];

        function dfs(node) {
            if (path.length > 0 && node === startNode) {
                // Phát hiện chu trình bắt đầu và kết thúc tại startNode
                cycles.push([...path, startNode]);
                return;
            }

            if (path.includes(node)) return; // Tránh quay lại các đỉnh đã duyệt trên đường đi hiện tại

            path.push(node);

            if (graph[node]) {
                for (const neighbor of graph[node]) {
                    dfs(neighbor);
                }
            }

            path.pop(); // Backtrack
        }

        dfs(startNode);
        return cycles;
    }

    function convertCyclesToGraphObjects(cycles, graphObjects) {
        const sourceLinks = graphObjects.flatMap((graph) => graph.links);

        return cycles.map((cycle) => {
            // Tạo danh sách nodes
            const nodes = [...new Set(cycle)].map((node) => ({ id: node }));

            // Tạo danh sách links từ các cặp phần tử liền kề
            const links = cycle
                .map((node, index) => {
                    const target =
                        index < cycle.length - 1 ? cycle[index + 1] : cycle[0];

                    // Bỏ qua liên kết nếu source === target
                    if (node === target) return null;

                    const link = { source: node, target };

                    // Tìm đối tượng trong sourceLinks để bổ sung thuộc tính
                    const matchedLink = sourceLinks.find(
                        (srcLink) =>
                            srcLink.source === String(node) &&
                            srcLink.target === String(target)
                    );
                    if (matchedLink) {
                        Object.assign(link, matchedLink);
                    }

                    return link;
                })
                .filter((link) => link !== null); // Loại bỏ các liên kết không hợp lệ

            return { nodes, links };
        });
    }

    const adjacencyList = convertToAdjacencyList(graphObjects);

    const cycles = findCyclesStartingAtNode(adjacencyList, startNode);

    const result = convertCyclesToGraphObjects(cycles, graphObjects);

    //console.log(result);
    return result;
}

export default Cycle_through_1;
