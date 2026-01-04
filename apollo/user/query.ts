import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const GET_AGENTS = gql`
	query GetAgents($input: AgentsInquiry!) {
		getAgents(input: $input) {
			list {
				_id
				memberType
				memberStatus
				memberAuthType
				memberPhone
				memberNick
				memberFullName
				memberImage
				memberAddress
				memberDesc
				memberCars
				memberArticles
				memberFollowers
				memberFollowings
				memberPoints
				memberLikes
				memberViews
				memberComments
				memberRank
				memberWarnings
				memberBlocks
				drivingLicenseNumber
				drivingLicensePhoto
				deletedAt
				createdAt
				updatedAt
				accessToken
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_MEMBER = gql(`
  query GetMember($input: String!) {
    getMember(memberId: $input) {
        _id
        memberType
        memberStatus
        memberAuthType
        memberPhone
        memberNick
        memberFullName
        memberImage
        memberAddress
        memberDesc
        memberCars
        memberArticles
        memberFollowers
        memberFollowings
        memberPoints
        memberLikes
        memberViews
        memberComments
        memberRank
        memberWarnings
        memberBlocks
        drivingLicenseNumber
        drivingLicensePhoto
        deletedAt
        createdAt
        updatedAt
        accessToken
        meLiked {
            memberId
            likeRefId
            myFavorite
        }
        meFollowed {
            followingId
            followerId
            myFollowing
        }
    }
}


`);

/**************************
 *        CARS        *
 *************************/

export const GET_CAR = gql`
	query GetCar($input: String!) {
		getCar(carId: $input) {
			_id
			carTitle
			carDescription
			brandType
			year
			fuelType
			transmission
			seats
			doors
			mileage
			engine
			carType
			carStatus
			carLocation
			carImages
			pricePerDay
			pricePerHour
			carViews
			deletedAt
			createdAt
			updatedAt
			carRank
			carLikes
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
			memberData {
				_id
				memberType
				memberStatus
				memberAuthType
				memberPhone
				memberNick
				memberFullName
				memberImage
				memberAddress
				memberDesc
				memberCars
				memberArticles
				memberFollowers
				memberFollowings
				memberPoints
				memberLikes
				memberViews
				memberComments
				memberRank
				memberWarnings
				memberBlocks
				drivingLicenseNumber
				drivingLicensePhoto
				deletedAt
				createdAt
				updatedAt
				accessToken
			}
		}
	}
`;

export const GET_CARS = gql`
	query GetCars($input: CarsInquiry!) {
		getCars(input: $input) {
			list {
				_id
				carTitle
				carDescription
				brandType
				year
				fuelType
				transmission
				seats
				doors
				mileage
				engine
				carType
				carStatus
				carLocation
				carImages
				pricePerDay
				pricePerHour
				carLikes
				carViews
				deletedAt
				createdAt
				updatedAt
				carRank
				memberData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberCars
					memberArticles
					memberFollowers
					memberFollowings
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberRank
					memberWarnings
					memberBlocks
					drivingLicenseNumber
					drivingLicensePhoto
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_AGENT_CARS = gql`
	query GetAgentCars($input: CarsInquiry!) {
		getAgentCars(input: $input) {
			list {
				_id
				carTitle
				carDescription
				brandType
				year
				fuelType
				transmission
				seats
				doors
				mileage
				engine
				carType
				carStatus
				carLocation
				carImages
				pricePerDay
				pricePerHour
				carLikes
				carViews
				createdAt
				updatedAt
				memberData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberCars
					memberArticles
					memberFollowers
					memberFollowings
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberRank
					memberWarnings
					memberBlocks
					drivingLicenseNumber
					drivingLicensePhoto
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
				carRank
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_FAVORITES = gql`
	query GetFavorites($input: OrdinaryInquiry!) {
		getFavorites(input: $input) {
			list {
				_id
				carTitle
				carDescription
				brandType
				year
				fuelType
				transmission
				seats
				doors
				mileage
				engine
				carType
				carStatus
				carLocation
				carImages
				pricePerDay
				pricePerHour
				carViews
				deletedAt
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				memberData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberCars
					memberArticles
					memberFollowers
					memberFollowings
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberRank
					memberWarnings
					memberBlocks
					drivingLicenseNumber
					drivingLicensePhoto
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
				carLikes
				carRank
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_VISITED = gql`
	query GetVisited($input: OrdinaryInquiry!) {
		getVisited(input: $input) {
			list {
				_id
				carTitle
				carDescription
				brandType
				year
				fuelType
				transmission
				seats
				doors
				mileage
				engine
				carType
				carStatus
				carLocation
				carImages
				pricePerDay
				pricePerHour
				carLikes
				carViews
				deletedAt
				createdAt
				updatedAt
				memberData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberCars
					memberArticles
					memberFollowers
					memberFollowings
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberRank
					memberWarnings
					memberBlocks
					drivingLicenseNumber
					drivingLicensePhoto
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
				carRank
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const GET_BOARD_ARTICLE = gql`
	query GetArticle($input: String!) {
		getArticle(articleId: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			articleComments
			memberId
			createdAt
			updatedAt
			memberData {
				_id
				memberType
				memberStatus
				memberAuthType
				memberPhone
				memberNick
				memberFullName
				memberImage
				memberAddress
				memberDesc
				memberCars
				memberArticles
				memberFollowers
				memberFollowings
				memberPoints
				memberLikes
				memberViews
				memberComments
				memberRank
				memberWarnings
				memberBlocks
				drivingLicenseNumber
				drivingLicensePhoto
				deletedAt
				createdAt
				updatedAt
				accessToken
			}
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
		}
	}
`;

export const GET_ARTICLES = gql`
	query GetArticles($input: ArticlesInquiry!) {
		getArticles(input: $input) {
			list {
				_id
				articleCategory
				articleStatus
				articleTitle
				articleContent
				articleImage
				articleViews
				articleLikes
				articleComments
				memberId
				createdAt
				updatedAt
				memberData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberCars
					memberArticles
					memberFollowers
					memberFollowings
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberRank
					memberWarnings
					memberBlocks
					drivingLicenseNumber
					drivingLicensePhoto
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_BOARD_ARTICLES = GET_ARTICLES;

/**************************
 *         COMMENT        *
 *************************/

export const GET_COMMENTS = gql`
	query GetComments($input: CommentsInquiry!) {
		getComments(input: $input) {
			list {
				_id
				commentStatus
				commentGroup
				commentContent
				commentRefId
				memberId
				createdAt
				updatedAt
				memberData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberCars
					memberArticles
					memberFollowers
					memberFollowings
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberRank
					memberWarnings
					memberBlocks
					drivingLicenseNumber
					drivingLicensePhoto
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         FOLLOW        *
 *************************/
export const GET_MEMBER_FOLLOWERS = gql`
	query GetMemberFollowers($input: FollowInquiry!) {
		getMemberFollowers(input: $input) {
			list {
				_id
				followingId
				followerId
				createdAt
				updatedAt
				followerData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberCars
					memberArticles
					memberFollowers
					memberFollowings
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberRank
					memberWarnings
					memberBlocks
					drivingLicenseNumber
					drivingLicensePhoto
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				meFollowed {
					followingId
					followerId
					myFollowing
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_MEMBER_FOLLOWINGS = gql`
	query GetMemberFollowings($input: FollowInquiry!) {
		getMemberFollowings(input: $input) {
			list {
				_id
				followingId
				followerId
				createdAt
				updatedAt
				meFollowed {
					followingId
					followerId
					myFollowing
				}
				followingData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberCars
					memberArticles
					memberFollowers
					memberFollowings
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberRank
					memberWarnings
					memberBlocks
					drivingLicenseNumber
					drivingLicensePhoto
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         BOOKING        *
 *************************/

export const GET_BOOKING = gql`
	query GetBooking($input: String!) {
		getBooking(input: $input) {
			_id
			userId
			agentId
			carId
			startDate
			endDate
			totalPrice
			bookingStatus
			paymentStatus
			createdAt
			updatedAt
			deletedAt
		}
	}
`;

export const GET_MY_BOOKINGS = gql`
	query GetMyBookings($input: BookingInquiry!) {
		getMyBookings(input: $input) {
			list {
				_id
				userId
				agentId
				carId
				startDate
				endDate
				totalPrice
				bookingStatus
				paymentStatus
				createdAt
				updatedAt
				deletedAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_AGENT_BOOKINGS_BY_AGENT = gql`
	query GetAgentBookingsByAGent($input: BookingInquiry!) {
		getAgentBookingsByAGent(input: $input) {
			list {
				_id
				userId
				agentId
				carId
				startDate
				endDate
				totalPrice
				bookingStatus
				paymentStatus
				createdAt
				updatedAt
				deletedAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_ADMIN_BOOKINGS = gql`
	query GetAdminBookingsByAdmin($input: BookingInquiry!) {
		getAdminBookingsByAdmin(input: $input) {
			list {
				_id
				userId
				agentId
				carId
				startDate
				endDate
				totalPrice
				bookingStatus
				paymentStatus
				createdAt
				updatedAt
				deletedAt
			}
			metaCounter {
				total
			}
		}
	}
`;
