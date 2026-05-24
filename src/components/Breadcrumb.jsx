import { Link } from 'react-router-dom';

const Breadcrumb = ({ items = [] }) => (
  <nav aria-label="breadcrumb">
    <ol className="breadcrumb mb-0">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <li key={i} className={`breadcrumb-item ${isLast ? 'active text-white' : ''}`}>
            {isLast || !item.to ? (
              <span className={isLast ? 'text-white' : 'text-secondary'}>{item.label}</span>
            ) : (
              <Link to={item.to} className="text-info text-decoration-none">{item.label}</Link>
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);

export default Breadcrumb;
