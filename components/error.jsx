import Link from "next/link";

export default ({title, message, customTag}) => <div className="h-100 d-flex flex-column justify-content-center align-items-center">
    <h2 className="text-danger">{title}</h2>
    <p className="text-danger">{message}</p>
    {customTag}
</div>