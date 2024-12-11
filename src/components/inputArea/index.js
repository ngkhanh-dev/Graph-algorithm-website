import React, { useState, useEffect, useContext, memo, useRef } from "react";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import "./input.css";
import { DataContext } from "../../App";

function TextInput() {
    const { updateSharedData, sharedData, warn, updateWarn } =
        useContext(DataContext);
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

    const stringRef = useRef("");

    useEffect(() => {
        const form = document.querySelector(".form-1");

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
                    if (item?.length >= 2) {
                        if (!quantity.includes(item[0])) quantity.push(item[0]);
                        if (!quantity.includes(item[1])) quantity.push(item[1]);
                    }

                    if (item?.length === 2) item.push(0);

                    if (
                        item[2] < 0 &&
                        warn !== "Trọng số của cạnh không thể là số âm"
                    ) {
                        stringRef.current =
                            "Trọng số của cạnh không thể là số âm";
                    }

                    links.push({
                        source: item[0],
                        target: item[1],
                        weight: item[2],
                    });
                    if (dir.value === "no_direct") {
                        links.push({
                            source: item[1],
                            target: item[0],
                            weight: item[2],
                        });
                    }
                }
                if (
                    item.length >= 4 &&
                    warn !==
                        "Chỉ được nhập tối đa 3 giá trị bao gồm 2 end-point và weight của cạnh"
                ) {
                    stringRef.current =
                        "Chỉ được nhập tối đa 3 giá trị bao gồm 2 end-point và weight của cạnh";
                }
            });

            quantity = quantity?.map((item) => {
                return {
                    id: item,
                };
            });
            updateWarn(`${stringRef.current}`);
            console.log(stringRef.current);
            if (stringRef.current === "") {
                updateSharedData({
                    nodes: quantity,
                    links: links,
                    direct: `${dir.value}`,
                });
            } else {
                updateSharedData({
                    nodes: [],
                    links: [],
                    direct: "",
                });
            }

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

        // console.log(warn + "1");
    }, []);

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
                    {/* <option value="" disabled hidden>
                        Chọn một tùy chọn
                    </option> */}
                    <option value="direct">Có hướng</option>
                    <option value="no_direct">Vô hướng</option>
                </select>
                {warn && <p>{warn}</p>}
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

export default memo(TextInput);
