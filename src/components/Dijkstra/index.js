// Priority Queue hỗ trợ thuật toán Dijkstra
class PriorityQueue {
    constructor() {
        this.queue = [];
    }

    push(node, priority) {
        this.queue.push({ node, priority });
        this.queue.sort((a, b) => a.priority - b.priority); // Sắp xếp theo độ ưu tiên (dựa vào trọng số)
    }

    pop() {
        return this.queue.shift().node; // Lấy phần tử có độ ưu tiên thấp nhất
    }

    isEmpty() {
        return this.queue.length === 0;
    }
}

async function dijkstra(graphObjects, startNode, endNode) {
    const { nodes, links } = graphObjects;

    // Chuyển links thành danh sách kề với trọng số (weight)
    function convertToAdjacencyList(graphObjects) {
        const adjacencyList = {};

        if (links) {
            links.forEach(({ source, target, weight }) => {
                if (!adjacencyList[source]) adjacencyList[source] = [];
                if (!adjacencyList[target]) adjacencyList[target] = [];

                adjacencyList[source].push({ node: target, weight });
                //adjacencyList[target].push({ node: source, weight }); // Vì đồ thị không hướng
            });
        }

        return adjacencyList;
    }

    const graph = convertToAdjacencyList(graphObjects);

    // Khởi tạo các giá trị
    const distances = {}; // Độ dài đường đi từ startNode đến các node khác
    const previousNodes = {}; // Lưu lại node trước đó trên đường đi ngắn nhất
    const nodesQueue = new PriorityQueue(); // Priority queue sẽ được dùng để lấy node có khoảng cách ngắn nhất

    // Khởi tạo khoảng cách từ startNode
    nodes.forEach(({ id }) => {
        distances[id] = id === startNode ? 0 : Infinity;
        previousNodes[id] = null;
        nodesQueue.push(id, distances[id]);
    });

    // Dijkstra's algorithm
    while (!nodesQueue.isEmpty()) {
        const currentNode = nodesQueue.pop();

        // Nếu tìm thấy endNode, kết thúc
        if (currentNode === endNode) break;

        if (graph[currentNode]) {
            graph[currentNode].forEach(({ node, weight }) => {
                const alt = distances[currentNode] + weight;
                if (alt < distances[node]) {
                    distances[node] = alt;
                    previousNodes[node] = currentNode;
                    nodesQueue.push(node, distances[node]);
                }
            });
        }
    }

    // Khôi phục đường đi từ startNode đến endNode
    const path = [];
    let currentNode = endNode;
    while (currentNode) {
        path.unshift(currentNode);
        currentNode = previousNodes[currentNode];
    }

    // Nếu không có đường đi, trả về mảng rỗng
    if (path[0] !== startNode) return [];

    //console.log("Đường đi từ", startNode, "đến", endNode, ":", path);
    return path;
}

export default dijkstra;
