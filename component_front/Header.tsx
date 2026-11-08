export default function Header() {
 const tiles=[['C','#d33f49',5],['S','#31875a',-5],['I','#3758f9',5],['2','#5ac5e7',-5],['0','#ffc83d',5],['5','#6c757d',-5]] as const;
 return <header className="mt-6 text-center"><div className="flex justify-center gap-3">{tiles.map(([letter,color,angle])=><span key={letter} style={{backgroundColor:color,transform:`rotate(${angle}deg)`}} className="inline-flex h-11 w-11 items-center justify-center rounded text-3xl font-bold text-white">{letter}</span>)}</div><div className="mt-3"><span className="inline-block rounded bg-[#212529] px-3 py-1 text-sm font-bold text-white">FRONT END SOFTWARE DEVELOPMENT</span></div></header>;
}
