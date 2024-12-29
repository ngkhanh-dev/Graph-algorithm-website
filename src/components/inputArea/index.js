import React, { useState, useEffect, useContext, memo, useRef } from "react";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import "./input.css";
import { DataContext } from "../../App";
import dijkstra from "../Dijkstra/index";
import Cycle_through_1 from "../Cycle_through_1/index";
import findCyclesStartingAtNode from "../Cycle_through_1/arrayReturn";
import findCyclesThroughTwoNodes from "../Cycle_through_2";
import findCyclesPassingThroughAtNodes from "../Cycle_through_1/arrayReturn";

function TextInput() {
    const {
        updateSharedData,
        sharedData,
        warn,
        updateWarn,
        warnAlgo,
        updateWarnAlgo,
        input,
        updateInput,
    } = useContext(DataContext);
    const [text, setText] = useState("");
    // const [input, updateInput] = useState("");

    const [selectedOption, setSelectedOption] = useState("");
    const [output, setOutput] = useState([]);

    const [activeIndex, setActiveIndex] = useState(null);

    const handleClick = (index) => {
        if (index !== activeIndex) {
            setActiveIndex(index);
        } else {
            setActiveIndex(null);
        }
    };

    const handleChangeOption = (e) => {
        setSelectedOption(e.target.value);
    };

    // Xử lý khi nhập đồ thị
    const handleChange = (e) => {
        const inputText = e.target.value;
        setText(inputText);
    };

    // Xử lý khi nhập đầu vào
    // const handleChangeInput = (e) => {
    //     console.log(e.target.value);
    //     const inputText = e.target.value;
    //     updateInput(inputText);
    // };

    const stringRef = useRef("");
    const stringRefAlgo = useRef("");

    useEffect(() => {
        const form = document.querySelector(".form-1");
        const form_2 = document.querySelector(".form-2");
        console.log("activeIndex: ", activeIndex);
        if (!isNaN(parseInt(activeIndex))) {
            const cycles = structuredClone(sharedData);

            cycles.links.forEach((link) => {
                link.mark = "0";
            });
            const arr_res = output[activeIndex];
            console.log(arr_res, activeIndex);

            // Lặp qua các cặp liên tiếp trong `nodes`
            for (let i = 0; i < arr_res.length - 1; i++) {
                const currentSource = arr_res[i];
                const currentTarget = arr_res[i + 1];

                // Chỉ thêm `mark: "1"` nếu đối tượng đã tồn tại
                cycles.links.forEach((link) => {
                    console.log(
                        link.source === currentSource &&
                            link.target === currentTarget
                    );
                    if (
                        link.source === currentSource &&
                        link.target === currentTarget
                    ) {
                        link["mark"] = "1";
                    }
                });
            }

            // Xử lý chu trình khép kín (liên kết cuối với phần tử đầu tiên)
            const lastSource = arr_res[arr_res.length - 1];
            const firstTarget = arr_res[0];

            cycles.links.forEach((link) => {
                if (link.source === lastSource && link.target === firstTarget) {
                    link.mark = "1";
                }
            });

            console.log(cycles);
            console.log(sharedData);
            if (JSON.stringify(sharedData) !== JSON.stringify(cycles)) {
                updateSharedData(cycles);
            }
        } else {
            const cycles = structuredClone(sharedData);

            cycles.links.forEach((link) => {
                link.mark = "0";
            });

            console.log(JSON.stringify(cycles));
            console.log(JSON.stringify(sharedData));
            if (JSON.stringify(sharedData) !== JSON.stringify(cycles)) {
                updateSharedData(cycles);
            }
        }

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const dir = document.querySelector("#direction-dropdown");
            let graph_value = document.querySelector("#graph-textarea");
            console.log("TextInput re-render", { warn, sharedData });
            stringRef.current = "";
            let quantity = [];
            let links = [];
            graph_value = graph_value?.value?.split("\n");

            graph_value?.forEach((item) => {
                item = item.replace(/\s+/g, " ").trim().split(" ");
                if (item.length > 1) {
                    if (
                        item?.length > 2 &&
                        item[2] > 0 &&
                        !isNaN(parseFloat(item[2]))
                    ) {
                        if (!quantity.includes(item[0])) quantity.push(item[0]);
                        if (!quantity.includes(item[1])) quantity.push(item[1]);
                    }

                    //if (item?.length === 2) item.push(0);

                    if (
                        isNaN(parseFloat(item[2])) &&
                        warn !== "Trọng số của cạnh phải là số"
                    ) {
                        stringRef.current = "Trọng số của cạnh phải là số";
                    }

                    if (
                        (item[2] <= 0 || !item[2]) &&
                        warn !==
                            "Trọng số của cạnh phải lớn hơn 0 và input phải có tham số thứ 3 là weight"
                    ) {
                        stringRef.current =
                            "Trọng số của cạnh phải lớn hơn 0 và input phải có tham số thứ 3 là weight";
                    }

                    if (
                        parseFloat(item[2]) > 0 &&
                        !isNaN(parseFloat(item[2]))
                    ) {
                        links.push({
                            source: item[0],
                            target: item[1],
                            weight: item[2],
                            mark: "0",
                        });
                        if (dir.value === "no_direct") {
                            links.push({
                                source: item[1],
                                target: item[0],
                                weight: item[2],
                                mark: "0",
                            });
                        }
                    }
                }
                if (
                    item.length >= 4 &&
                    warn !==
                        "Chỉ được nhập 3 giá trị bao gồm 2 end-point và weight của cạnh"
                ) {
                    stringRef.current =
                        "Chỉ được nhập 3 giá trị bao gồm 2 end-point và weight của cạnh";
                }
            });
            console.log("warn:   ", warn);

            quantity = quantity?.map((item) => {
                return {
                    id: item,
                };
            });
            updateWarn(`${stringRef.current}`);
            console.log(stringRef.current);
            if (stringRef.current === "") {
                const newData = {
                    nodes: [...quantity],
                    links: [...links],
                    direct: `${dir?.value}`,
                };
                await updateSharedData(newData);
                setOutput([]);
            }
            // else {
            //     updateSharedData({
            //         nodes: [],
            //         links: [],
            //         direct: "",
            //     });
            // }

            // await fetch("http://localhost:3005/api/v1/graphs/create", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify({
            //         nodes: quantity,
            //         links: links,
            //         direct: `${dir.value}`,
            //     }),
            // })
            //     .then((res) => res.json())
            //     .then((data) => {
            //         console.log(data);

            //         updateSharedData(data);
            //     });
        });

        form_2.addEventListener("submit", async (e) => {
            e.preventDefault();
            stringRefAlgo.current = "";
            const inputField = document.querySelector("#input-textarea");
            const algoSelect = document.querySelector("#algorithm-dropdown");
            console.log("input", inputField.value, ", algo", algoSelect.value);
            const inputValue = inputField.value;
            const algorithm = algoSelect.value;
            console.log(input);
            updateInput(inputValue);
            form_2.addEventListener("submit", async (e) => {
                e.preventDefault();
                const inputField = document.querySelector("#input-textarea");
                const algoSelect = document.querySelector(
                    "#algorithm-dropdown"
                );
                console.log(
                    "input",
                    inputField.value,
                    ", algo",
                    algoSelect.value
                );
                const inputValue = inputField.value;
                const algorithm = algoSelect.value;
                console.log(input);
                updateInput(inputValue);
                if (algorithm === "dijkstra") {
                    const inpValue = inputValue
                        .replace(/\s+/g, " ")
                        .trim()
                        .split(" ");

                    if (inpValue.length === 2) {
                        const out = await dijkstra(
                            sharedData,
                            inpValue[0],
                            inpValue[1]
                        );
                        setOutput(out);
                    } else if (
                        warnAlgo !== "Chỉ nhập 2 tham số đối với thuật toán này"
                    ) {
                        stringRefAlgo.current =
                            "Chỉ nhập 2 tham số đối với thuật toán này";
                    }
                } else if (algorithm === "findCyclesThroughTwoNodes") {
                    const inpValue = inputValue
                        .replace(/\s+/g, " ")
                        .trim()
                        .split(" ");

                    if (inpValue.length === 2) {
                        const out = await findCyclesThroughTwoNodes(
                            sharedData,
                            inpValue[0],
                            inpValue[1]
                        );
                        setOutput(out);
                    } else if (
                        warnAlgo !== "Chỉ nhập 2 tham số đối với thuật toán này"
                    ) {
                        stringRefAlgo.current =
                            "Chỉ nhập 2 tham số đối với thuật toán này";
                    }
                } else if (algorithm === "Cycle_through_1") {
                    const inpValue = inputValue
                        .replace(/\s+/g, " ")
                        .trim()
                        .split(" ");
                    if (inpValue.length === 1) {
                        const out = await findCyclesPassingThroughAtNodes(
                            sharedData,
                            inpValue[0]
                        );
                        setOutput(out);
                    } else if (
                        warnAlgo !== "Chỉ nhập 1 tham số đối với thuật toán này"
                    ) {
                        stringRefAlgo.current =
                            "Chỉ nhập 2 tham số đối với thuật toán này";
                    }
                }

                updateWarnAlgo(`${stringRefAlgo.current}`);
            });
        });

        // console.log(warn + "1");
    }, [sharedData, activeIndex]);
    return (
        <div className="input-container">
            <form className="textarea-container form-1">
                <label htmlFor="graph-textarea">Nhập đồ thị của bạn:</label>
                <textarea
                    id="graph-textarea"
                    placeholder="Nhập đồ thị của bạn"
                    value={text}
                    onChange={handleChange}
                ></textarea>
                <label htmlFor="direction-dropdown">Chọn kiểu:</label>
                <select
                    id="direction-dropdown"
                    value={selectedOption}
                    onChange={handleChangeOption}
                    className="dropdown"
                >
                    {/* <option value="" disabled hidden>
                        Chọn một tùy chọn
                    </option> */}
                    <option value="direct">Có hướng</option>
                    <option value="no_direct">Vô hướng</option>
                </select>
                {warn && <p className="warn-log">{warn}</p>}
                <Button
                    type="submit"
                    className="submit-btn"
                    variant="outline-light"
                >
                    Submit
                </Button>
            </form>

            <div className="input-2-block">
                <div>
                    <form className="textarea-container form-2">
                        <label htmlFor="input-textarea">
                            Nhập input của bạn:
                        </label>
                        <input
                            id="input-textarea"
                            placeholder="Nhập đầu vào của bạn"
                            //value={input}
                            // rows="1"
                            // onChange={handleChangeInput}
                        ></input>
                        <label htmlFor="direction-dropdown">Chọn kiểu:</label>
                        <select
                            id="algorithm-dropdown"
                            value={selectedOption}
                            onChange={handleChangeOption}
                            className="dropdown"
                        >
                            <option value="" disabled hidden>
                                Chọn một tùy chọn
                            </option>
                            <option value="dijkstra">
                                Tìm đường đi ngắn nhất
                            </option>
                            <option value="findCyclesThroughTwoNodes">
                                Tìm chu trình qua 2 điểm
                            </option>
                            <option value="Cycle_through_1">
                                Tìm chu trình xuất phát từ 1 điểm cụ thể
                            </option>
                        </select>
                        {warnAlgo && <p className="warn-log">{warnAlgo}</p>}
                        <Button
                            type="submit"
                            className="submit-btn"
                            variant="outline-light"
                        >
                            Submit
                        </Button>
                    </form>
                </div>
                <div className="outputAlgo-container">
                    <ul className="output-list">
                        {(output || []).map((item, index) => {
                            const content = Array.isArray(item);
                            console.log(content);
                            if (content) {
                                return (
                                    <li
                                        className="output-item"
                                        style={{
                                            backgroundColor:
                                                activeIndex === index
                                                    ? "blue"
                                                    : "#ccc",
                                            color:
                                                activeIndex === index
                                                    ? "white"
                                                    : "black",
                                        }}
                                        onClick={() => handleClick(index)}
                                        key={index}
                                    >
                                        {item.join(" ")}
                                    </li>
                                );
                            } else {
                                function calculateTotalDistance(
                                    path,
                                    graphObjects
                                ) {
                                    const { links } = graphObjects;

                                    // Tính tổng trọng số của các cạnh trong đường đi
                                    let totalDistance = 0;

                                    // Duyệt qua các cặp đỉnh trong mảng path
                                    for (let i = 0; i < path.length - 1; i++) {
                                        const startNode = path[i];
                                        const endNode = path[i + 1];

                                        // Tìm trọng số của cạnh giữa startNode và endNode
                                        const edge = links.find(
                                            (link) =>
                                                (link.source === startNode &&
                                                    link.target === endNode) ||
                                                (link.source === endNode &&
                                                    link.target === startNode)
                                        );

                                        // Nếu tìm thấy cạnh, cộng trọng số vào tổng
                                        if (edge) {
                                            totalDistance += parseFloat(
                                                edge.weight
                                            );
                                        } else {
                                            console.log(
                                                `Không tìm thấy cạnh giữa ${startNode} và ${endNode}`
                                            );
                                            return Infinity; // Trả về Infinity nếu không có cạnh giữa hai đỉnh
                                        }
                                    }

                                    return totalDistance;
                                }

                                const totalDistance = calculateTotalDistance(
                                    output,
                                    sharedData
                                );

                                return (
                                    <li
                                        className="output-item"
                                        style={{
                                            backgroundColor:
                                                activeIndex === index
                                                    ? "blue"
                                                    : "#ccc",
                                            color:
                                                activeIndex === index
                                                    ? "white"
                                                    : "black",
                                        }}
                                        onClick={() => handleClick(index)}
                                        key={index}
                                    >
                                        {output
                                            .join(" ")
                                            .concat(" | Distance : ")
                                            .concat(totalDistance)}
                                    </li>
                                );
                            }
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default memo(TextInput);
