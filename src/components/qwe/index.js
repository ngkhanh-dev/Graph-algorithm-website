import React, { useState, useEffect, useContext } from "react";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import "./input.css";
import { DataContext } from "../../App";

function TextInput() {
    const { updateSharedData, sharedData } = useContext(DataContext);
    const [text, setText] = useState("");
    const [input, setInput] = useState("");

    const [selectedOption, setSelectedOption] = useState("");

    const handleChangeOption = (e) => {
        setSelectedOption(e.target.value);
    };

    // Xử lý khi nhập đồ thị
    const handleChange = (e) => {
        const inputText = e.target.value;
        setText(inputText);
    };

    // Xử lý khi nhập đầu vào
    const handleChangeInput = (e) => {
        const inputText = e.target.value;
        setInput(inputText);
    };

    useEffect(() => {
        const form = document.querySelector(".form-1");
        let graph_value = document.querySelector("#graph-textarea");
        const dir = document.querySelector("#direction-dropdown");
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            let quantity = [];
            let links = [];
            graph_value = graph_value?.value?.split("\n");
            console.log(graph_value);
            graph_value?.forEach((item) => {
                item = item.split(" ");
                if (item.length > 1) {
                    if (item?.length >= 2) {
                        if (!quantity.includes(item[0])) quantity.push(item[0]);
                        if (!quantity.includes(item[1])) quantity.push(item[1]);
                    }

                    if (item?.length === 2) item.push(0);

                    links.push({
                        source: item[0],
                        target: item[1],
                        weight: item[2],
                    });
                    if (dir === "no_direct") {
                        links.push({
                            source: item[1],
                            target: item[0],
                            weight: item[2],
                        });
                    }
                }
            });
            quantity = quantity?.map((item) => {
                return {
                    id: item,
                };
            });
            await fetch("http://localhost:3005/api/v1/graphs/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nodes: quantity,
                    links: links,
                    direct: dir,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    // console.log(data);
                    updateSharedData(data);
                });
        });
    }, [sharedData]);

    // Submit dữ liệu đồ thị lên server
    // const handleSubmit = (e) => {
    //     e.preventDefault();
    // };

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
                    <option value="" disabled hidden>
                        Chọn một tùy chọn
                    </option>
                    <option value="direct">Có hướng</option>
                    <option value="no_direct">Vô hướng</option>
                </select>
                <Button
                    type="submit"
                    className="submit-btn"
                    variant="outline-light"
                >
                    Submit
                </Button>
            </form>

            <form className="textarea-container form-2">
                <label htmlFor="input-textarea">Nhập input của bạn:</label>
                <input
                    id="input-textarea"
                    placeholder="Nhập đầu vào của bạn"
                    value={input}
                    rows="1"
                    onChange={handleChangeInput}
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
                    <option value="shortest_path">
                        Tìm đường đi ngắn nhất
                    </option>
                    <option value="cycle_through_2_point">
                        Tìm chu trình qua 2 điểm
                    </option>
                    <option value="cycle_begin_specific_point">
                        Tìm chu trình xuất phát từ 1 đỏm cụ thể
                    </option>
                </select>
            </form>
        </div>
    );
}

export default TextInput;
