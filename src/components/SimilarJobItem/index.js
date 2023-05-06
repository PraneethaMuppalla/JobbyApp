import {AiFillStar} from 'react-icons/ai'
import {TiLocation} from 'react-icons/ti'
import {FaShoppingBag} from 'react-icons/fa'

import './index.css'

const SimilarJobItem = props => {
  const {each} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    title,
    location,
    rating,
  } = each

  return (
    <li className="similar-product-item">
      <div className="product-item">
        <div className="logo-container">
          <img
            src={companyLogoUrl}
            className="logo"
            alt="similar job company logo"
          />
          <div>
            <h1 className="title">{title}</h1>
            <div className="rating-container">
              <AiFillStar className="star" />

              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>
        <div className="middle-container">
          <div className="location-container">
            <TiLocation className="location-icon" />
            <p className="location">{location}</p>
            <FaShoppingBag className="location-icon" />
            <p className="location">{employmentType}</p>
          </div>
        </div>
        <hr className="line" />
        <h1 className="title">Description</h1>
        <p className="description">{jobDescription}</p>
        <h1 className="title">Skills</h1>
      </div>
    </li>
  )
}
export default SimilarJobItem
