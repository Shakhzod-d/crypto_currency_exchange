import React from "react";
import { FiArrowDown } from "react-icons/fi";
import "./Table.css";
import { status } from "../../helper";

function Table({ items, onDelete }) {
  function renderTableHeader() {
    const columns = ["Name", "Price", "Status", "Action"];

    return (
      <tr>
        {columns.map((column, index) => (
          <th key={index}>{column}</th>
        ))}
      </tr>
    );
  }

  function renderTableRows() {
    return items?.map((item, index) => (
      <tr key={index}>
        <td>{item.name}</td>
        <td>
          {item.currency}
          {item.price}
        </td>
        <td>
          {item.status === status.UP && (
            <FiArrowDown
              size={22}
              color="green"
              style={{ transform: "rotateX(180deg)" }}
            />
          )}

          {item.status === status.DOWN && <FiArrowDown size={22} color="red" />}
          {item.status === status.NO_CHANGE || (item.status === "" && "---")}
        </td>
        <td>
          <button onClick={() => onDelete(item.name)}>Delete</button>
        </td>
      </tr>
    ));
  }

  return (
    <table className="table">
      <thead>{renderTableHeader()}</thead>
      <tbody>{renderTableRows()}</tbody>
    </table>
  );
}

export default Table;
