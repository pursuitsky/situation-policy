<template>
<!--  这里放置页面简单布局及其数据 -->
  <div class="pageContainer">
    <div class="res" v-for="(item,index) in sd[currentPage-1]" :key="index">{{item.name}}</div>

    <div style="clear:both;width:100%;height:0"></div>
    <div>当前第{{currentPage}}页</div>
    <ul class="pagesInner">
      <li class="page">
        <span class="fa fa-chevron-left" aria-hidden="true" @click="prevOrNext(-1)">"zuo"</span>
      </li>
      <li
        class="page"
        v-for="(item, index) in pages"
        :key="index"
        :class="{actived: item === currentPage}"
        @click="select(item)"
      >
        <span>{{item}}</span>
      </li>
      <li class="page">
        <span class="fa fa-chevron-right" aria-hidden="true" @click="prevOrNext(1)">"you"</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentPage: 1,
      totalPages: 50,
      sd: [//这里是模拟数据
        {
          name: "11"
        },
        { name: "2" },
        { name: "3" },
        { name: "4" },
        { name: "51" },
        {},
        {},
        { name: "8" },
        {},
        { name: "10" },
        {},
        {},
        { name: "13" },
        {},
        { name: "10" },
        {},
        {},
        { name: "13" },
        {},
        {},
        { name: "16" },
        {},
        { name: "18+" },
        {},
        {},
        { name: "21" },
        {},
        { name: "23" },
        {},
        { name: "25" },
        {
          name: "last"
        }
      ]
    };
  },
  computed: {
    pages() {
      const c = this.currentPage;
      const t = this.totalPages;
if (c <= 5) {
        if (t == 6) {
          return [1, 2, 3, 4, 5,6]; //第一种情况【0】
        }
       else if (t == 5) {
          return [1, 2, 3, 4, 5]; //第一种情况【1】
        } else if (t == 4) {
          return [1, 2, 3, 4]; //第一种情况【2】
        } else if (t == 3) {
          return [1, 2, 3]; //第一种情况【3】
        } else if (t == 2) {
          return [1, 2]; //第一种情况【4】
        } else if (t == 1) {
          return [1]; //第一种情况【5】
        } else {
          return [1, 2, 3, 4, 5, "...", t]; //第一种情况
        }
      } else if (c >= t - 4) {
        return [1, "...", t - 4, t - 3, t - 2, t - 1, t]; //第二种情况
      } else {
        return [1, "...", c - 1, c, c + 1, "...", t]; //第三种情况
      }
//else结束
    }
  }, //com
  methods: {
    select(n) {
      if (n === this.currentPage) return;
      if (typeof n === "string") return;
      this.currentPage = n;
    },
    prevOrNext(n) {
      this.currentPage += n;
      this.currentPage < 1
        ? (this.currentPage = 1)
        : this.currentPage > this.totalPages
          ? (this.currentPage = this.totalPages)
          : null;
    }
  },
  created() {
    var arr = [];
    for (var i = 0, len = this.sd.length; i < len; i += 3) {
      arr.push(this.sd.slice(i, i + 3));//这里的3表示，根据3条来进行分页
    }
    console.log(arr);
    this.sd = arr;
    this.totalPages = arr.length;
          that.currentPage = 1;
  }
};
</script>


<style scoped>
/* 最后是简单的样式问题 */
.res {
  width: 30%;
  float: left;
  background: #999;
  margin: 10rpx 0;
  height: 80rpx;
  margin-right: 1%;
}
.page {
  padding: 10rpx;
  border: 1rpx solid #999;
  margin: 10rpx;
  float: left;
}
.actived {
  background: red;
}
li{
    list-style-type: none;
}
</style>
