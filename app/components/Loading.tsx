const Loading = () => {
    return (
        <div className="fixed inset-0 flex flex-col space-y-3 items-center justify-center z-10 bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" xmlSpace="preserve" width="48" height="48" fill="#fff" stroke="#fff">
                <g strokeWidth="0" />
                <g strokeLinecap="round" strokeLinejoin="round" />
                <path fill="#752f4d" d="M512 0H300.522v33.391h-66.783v33.392h-66.782v33.391h-33.392v33.391h-33.391v33.393H66.783v66.782H33.391v66.784H0V512h144.696V311.652h33.393l-.002-66.782h33.762v-33.392l33.022.001-.001-33.392h66.782v-33.391H512z" />
                <path fill="#e5b815" d="M512 222.609H322.783l.001 33.391h-33.39l-.003 33.391h-33.39L256 322.783h-33.391V512h133.565V389.565h33.391v-33.391H512v-33.391z" />
                <path fill="#495cee" d="M512 110.562H311.652l.001 34.134h-66.782l-.001 33.391h-33.391l-.001 33.391h-33.39l-.001 33.392h-33.389l-.002 66.782h-33.392V512H256V322.783h33.392l-.001-33.392h33.393L322.783 256H512z" />
                <path d="M289.391 256h33.391v33.391h-33.391zM256 289.391h33.391v33.391H256zm-44.522-111.304h33.391v33.391h-33.391zm-33.391 33.391h33.391v33.391h-33.391zm-33.391 33.392h33.391v66.783h-33.391zm211.478 111.304h33.391v33.391h-33.391z" />
                <path d="M322.783 478.609h-66.782V322.783H222.61v155.826h-77.914V311.652h-33.392v166.957H33.391V300.522H0V512h356.174V389.565h-33.391zM133.565 100.174h33.391v33.391h-33.391zm-33.391 33.391h33.391v33.391h-33.391zM233.739 33.391h66.783v33.391h-66.783zm-66.782 33.392h66.783v33.391h-66.783zM66.783 166.957h33.391v66.783H66.783zm-33.392 66.782h33.391v66.783H33.391z" />
                <path d="M478.609 0H300.523v33.391h178.086v77.913H311.653v33.392h-66.782v33.391h66.782v-33.391h166.956v77.913H322.784V256h155.825v66.783h-89.044v33.391H512V0z" />
            </svg>
            <p className="text-white text-center text-sm font-semibold">Loading ...</p>
        </div>
    )
}

export default Loading