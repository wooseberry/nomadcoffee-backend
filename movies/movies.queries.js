import client from "../client";
//resolver
export default  {
  Query: {
    movies: () => client.movie.findMany(),
    movie: (_,{id}) => client.movie.findUnique({where: {id},data: {year}})
  }
};

