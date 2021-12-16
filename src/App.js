import './App.css';
import React, {Component} from 'react'

class SearchItem extends Component {
  render() {
    const {tips, value, onChange} = this.props;

    return (
      <div>
        <span className={"margin"}>{tips}</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e)}/>
      </div>
    );
  }
}

class ShopGoodItem extends Component {
  render() {
    const {name, price, stocked} = this.props;

    return (
      <div key={name} className={"text"}>
        <span className={"margin"}>{name}</span>
        <span className={"margin"}>￥ {price}</span>
        <span>{stocked ? "有货" : "无货"}</span>
      </div>
    );
  }
}

class DataShopItem {
  constructor(name, price, stocked) {
    this.name = name || '';
    this.price = price || 0;
    this.stocked = stocked || false;
  }
}

class DataShop {
  constructor(category, items) {
    this.name = category || '';
    this.items = items || [];
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {category: "运动类", price: 49.99, stocked: true, name: "足球"},
        {category: "运动类", price: 9.99, stocked: true, name: "篮球"},
        {category: "运动类", price: 29.99, stocked: false, name: "羽毛球"},
        {category: "电子类", price: 99.99, stocked: true, name: "iPod Touch"},
        {category: "电子类", price: 399.99, stocked: false, name: "iPhone 5"},
        {category: "电子类", price: 199.99, stocked: true, name: "Nexus 7"}
      ],
      shops: [],
      shopsFilter: {
        nameKeyword: '',
        priceKeyword: '',
        stockedKeyword: null,
      }
    }
  }

  componentDidMount() {
    const {data} = this.state;
    let category = [];
    for (let index in data) {
      let item = data[index];
      if (!category.includes(item.category)) {
        category.push(item.category);
      }
    }

    let shops = [];
    for (let index in category) {
      let item = category[index];
      let shopItems = data
        .filter((e) => e.category === item)
        .map((e) => new DataShopItem(e.name, e.price, e.stocked));
      shops.push(
        new DataShop(
          item,
          shopItems
        )
      )
    }

    this.setState({
      shops: shops
    })
  }

  render() {
    const {shops} = this.state;
    const {nameKeyword, priceKeyword, stockedKeyword} = this.state.shopsFilter;
    const items = shops.length === 0 ? null : (
      shops.map((e) => (
        <div key={e.name} className={"title"}>
          <div>{e.name}</div>
          {
            e.items.filter((e) => this.allFilter(e)).map((item => (
              <ShopGoodItem
                key={item.name}
                name={item.name}
                price={item.price}
                stocked={item.stocked}/>
            )))
          }
        </div>
      ))
    )

    return (
      <div>
        <SearchItem
          tips={"根据名称来搜索:"}
          value={nameKeyword}
          onChange={(e) => this.changeNameKeyword(e)}/>
        <SearchItem
          tips={"根据价格来搜索:"}
          value={priceKeyword}
          onChange={(e) => this.changePriceKeyword(e)}/>
        <div>
          <span className={"margin"}>根据库存来搜索:</span>
          <button
            className={stockedKeyword === null ? "active" : ""}
            onClick={() => this.changeStockedKeyword(null)}>全部
          </button>
          <button
            className={stockedKeyword === true ? "active" : ""}
            onClick={() => this.changeStockedKeyword(true)}>有库存
          </button>
          <button
            className={stockedKeyword === false ? "active" : ""}
            onClick={() => this.changeStockedKeyword(false)}>无库存
          </button>
        </div>
        <div className={"title"}>
          <span className={"margin"}>类别</span>
          <span>价格</span>
        </div>
        {items}
      </div>
    );
  }

  nameFilter(e) {
    const {nameKeyword} = this.state.shopsFilter;

    if (nameKeyword === null || nameKeyword === '') {
      return true;
    } else {
      return e.toUpperCase().indexOf(nameKeyword.toUpperCase()) !== -1;
    }
  }

  changeNameKeyword(e) {
    const {shopsFilter} = this.state;

    shopsFilter.nameKeyword = e.target.value;

    this.setState({
      shopsFilter: shopsFilter
    })
  }

  priceFilter(e) {
    const {priceKeyword} = this.state.shopsFilter;

    if (priceKeyword === null || priceKeyword === '') {
      return true;
    } else {
      return parseFloat(e) > priceKeyword;
    }
  }

  changePriceKeyword(e) {
    const {shopsFilter} = this.state;

    let value = e.target.value;

    if (value === "") {
      shopsFilter.priceKeyword = "";
      this.setState({
        shopsFilter: shopsFilter
      })
    } else {
      let flag = false;
      let result = value.charAt(value.length - 1);

      if(result === '.') {
        flag = true;
      } else {
        for (let i = 0; i < 10; i++) {
          if (result === `${i}`) {
            flag = true;
            break;
          }
        }
      }

      let count = 0;
      let arr = value.split("");
      for(let i = 0; i < arr.length; i++) {
        if(arr[i] === '.') {
          count++;
        }
      }
      if (flag && count < 2) {
        shopsFilter.priceKeyword = value;
        this.setState({
          shopsFilter: shopsFilter
        })
      }
    }
  }

  stockedFilter(e) {
    const {stockedKeyword} = this.state.shopsFilter;

    if (stockedKeyword === null) {
      return true;
    } else {
      return e === stockedKeyword;
    }
  }

  changeStockedKeyword(e) {
    const {shopsFilter} = this.state;

    shopsFilter.stockedKeyword = e;

    this.setState({
      shopsFilter: shopsFilter
    })
  }

  allFilter(e) {
    return this.nameFilter(e.name)
      && this.priceFilter(e.price)
      && this.stockedFilter(e.stocked);
  }
}

export default App;
