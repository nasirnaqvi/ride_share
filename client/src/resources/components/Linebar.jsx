import { Link } from 'react-router-dom';

export default function Linebar({name}) {
    return (
        <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-black-300"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-4 text-lg font-bold">{name}</span>
        </div>
      </div>
    )
}