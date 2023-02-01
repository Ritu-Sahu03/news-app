import React, { useEffect, useState } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner'
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";


const News =(props)=>{
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResult, setTotalResult] = useState(0)
  

  const capitalizeFirstLetter=(string)=> {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

   const updateNews=async()=>{
    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true);
    let data = await fetch(url);
    let parsedData = await data.json();
    setArticles(parsedData.articles);
    setTotalResult(parsedData.totalResult);
    setLoading(false);
   
    props.setProgress(100);
  }

  useEffect(() => {
  document.title = `${capitalizeFirstLetter(props.category)}-NewsHunter`;
  updateNews();
  }, [])
  

const handlePreClick=async()=>{
  setPage(page-1)
  updateNews();
}
const handleNextClick=async()=>{
  setPage(page+1);
  updateNews();
}

const fetchMoreData = async () => {
  setPage(page+1);
  const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
  let data = await fetch(url);
  let parsedData = await data.json();
  setArticles(articles.concat(parsedData.articles));
  setTotalResult(parsedData.totalResult);
};

    return (
      <>
        <h1 className="text-center" style={{margin : "40px 0px"}}>NewsHunter-Top {capitalizeFirstLetter(props.category)} Headline</h1>
        {loading && <Spinner/>}
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResult}
          loader={<Spinner/>}
        >
      <div className="container">
        <div className="row">
          {articles.map((element) => {
            return (
              <div className="col-md-4" key={element.url}>
                <NewsItem title={element.title ? element.title.slice(0, 45) : ""} description={element.description ? element.description.slice(0, 80) : ""} imgUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
              </div>
            );
          })}
        </div>
      </div>
        </InfiniteScroll>
      </>
    );
}

News.defaultProps={
  country : "in",
  pageSize: 8,
  category : "general"
}
News.propTypes={
  country: PropTypes.string,
  pageSize : PropTypes.number,
  category : PropTypes.string
}

export default News