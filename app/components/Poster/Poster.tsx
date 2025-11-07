import noImage from './noImage.svg'

type PosterProps = {
    path: string | null | undefined,
    altText: string | null | undefined,
    width: number | null
}
const Poster = ({ path, altText, width = 200 }: PosterProps) => {

    return (
        <>
            {path ? <img
                src={`https://image.tmdb.org/t/p/w${width}/${path}`}
                alt={altText || "Poster"}
            /> :
                <img
                    src={noImage}
                    alt={"No Image Found"}
                />
            }

        </>
    );
}

export default Poster;