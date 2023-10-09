import { Link } from "react-router-dom";
import "./pagination.css";

const Pagination = ({ currentPage, range, Logic, pageLimit, UpdatePage }) => {
  return (
    <div>
      <nav className="mt-3">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
            <Link
              className="page-link"
              to="#"
              onClick={() => UpdatePage("Home")}
            >
              Home
            </Link>
          </li>
          <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
            <Link
              className="page-link"
              to="#"
              onClick={() => UpdatePage("DECREMENT")}
            >
              Previous
            </Link>
          </li>
          {range.map((num, index) => {
            return (
              <li
                className={`page-item ${
                  currentPage === index ? "active" : ""
                } `}
                key={num}
              >
                <Link
                  className="page-link"
                  to="#"
                  onClick={() => Logic(num - 1)}
                >
                  {num}
                </Link>
              </li>
            );
          })}
          <li
            className={`page-item ${
              currentPage === pageLimit - 1 ? "disabled" : ""
            }`}
          >
            <Link
              className="page-link"
              to="#"
              onClick={() => UpdatePage("INCREMENT")}
            >
              Next
            </Link>
          </li>
          <li
            className={`page-item ${
              currentPage === pageLimit - 1 ? "disabled" : ""
            }`}
          >
            <Link
              className="page-link"
              to="#"
              onClick={() => UpdatePage("Last")}
            >
              Last
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
