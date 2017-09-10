import styled from 'styled-components';

export const Title = styled.h1`
  font-size: 52px;
  text-align: center;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: ${props => props.row ? 'row' : 'column'};
  height: ${props => props.row ? '' : '100%'};
  justify-content: center;
  align-items: center;
  text-align: center;
`;

export const NavLink = styled.h3`
  color: #CBCBCB;
  margin-top: 0px;
`;

export const Form = styled.form`
  margin: 0px;
  padding: 0px;
  display: flex;
  height: 45px;
  align-items: center;
  justify-content: center;
`
export const Button = styled.button`
  border: 0px;
  height: 37px;
  width: 37px;
  margin: 0px 0px;
  padding: 0px 0px;
  height: 36px;
  background-color: white;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
`;

export const Rank = styled.h3`
  padding: 0px 0px;
  margin: 0px 0px;
  color: #1E555C;
`

export const Neighborhood = styled.h3`
  color: #E8A155;
  margin-bottom: 3px;
`

export const Description = styled.p`
  margin: 0px 5px;
  padding: 0px 5px;
`
export const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 25%;
  padding: 20px;  
  text-align: center;
  background-color: white;
  background-image: linear-gradient(white, #EFECEA);
  border-radius: 5px;
  box-shadow: 0px 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  &:hover{
    background-image: linear-gradient(#F7F7F7, #F7F7F7);
  }
`

export const Row = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
  padding-left: 100px;
  padding-right: 100px;
  color: #565353;
  margin: 20px 0px;
`

export const Text = styled.p`
  font-size: 20px;
  padding: 0px 200px;
  margin: 10px 0px;
`

export const Em = styled.span`
  color: #E8A155;
`