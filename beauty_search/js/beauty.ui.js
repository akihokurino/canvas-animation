/*
 * beauty.ui.js - UI library for Beauty Web Service
 * AUTHOR: Toshimasa Ishibashi iandeth [at] gmail.com
 * VERSION: 1.00
 */

// everything wrapped in jQuery -
// same effect as jQuery.noConflict() for use with prototype.js
(function($){

if( typeof( Beauty ) != 'function' ) {
    Beauty = function (){};
}
if( typeof( Beauty.UI ) != 'function' ) {
    Beauty.UI = function (){};
}

/*
 * Beauty.UI.Places.Pulldown - エリア選択 プルダウン
 * VERSION 1.01
 * CHANGES
 *   2008-03-26 v1.01 Recruit.UI.Base.Hierarchy 利用に変更
 *   2008-02-01 v1.00 released
 */
if( typeof( Beauty.UI.Places ) != 'function' ) {
    Beauty.UI.Places = function (){};
}
Beauty.UI.Places.Pulldown =
Class.create( Recruit.UI.Base.Hierarchy, {
    _get_definition : function (){
        var ret = [
            { cls: Beauty.UI.Places.ServiceArea.Pulldown },
            { cls: Beauty.UI.Places.MiddleArea.Pulldown  },
            { cls: Beauty.UI.Places.SmallArea.Pulldown   }
        ];
        return ret;
    }
});

/*
 * Beauty.UI.Places.ServiceArea.Pulldown
 */
if( typeof( Beauty.UI.Places.ServiceArea ) != 'function' ) {
    Beauty.UI.Places.ServiceArea = function (){};
}
Beauty.UI.Places.ServiceArea.Pulldown =
Class.create( Recruit.UI.Base.Pulldown.JSONP, {
    _get_def_props: function (){
        return {
            id         : 'bty-service-area-sel',
            name       : 'service_area',
            label      : 'サービスエリア',
            has_parent : false
        };
    },
    _get_driver: function (){
        return new Recruit.UI.Driver.JSONP({
            url : '/beauty/service_area/v1/'
        });
    },
    _get_selections_material: function (){
        return this.driver.results.service_area;
    }
});

/*
 * ABROAD.UI.Places.MiddleArea.Pulldown
 */
if( typeof( Beauty.UI.Places.MiddleArea ) != 'function' ) {
    Beauty.UI.Places.MiddleArea = function (){};
}
Beauty.UI.Places.MiddleArea.Pulldown =
Class.create( Recruit.UI.Base.Pulldown.JSONP, {
    _get_def_props: function (){
        return {
            id         : 'bty-middle-area-sel',
            name       : 'middle_area',
            label      : '中エリア',
            has_parent : true,
            parent     : 'service_area',
            service_area : ''
        };
    },
    _get_driver: function (){
        return new Recruit.UI.Driver.JSONP({
            url : '/beauty/middle_area/v1/'
        });
    },
    _get_selections_material: function (){
        return this.driver.results.middle_area;
    }
});

/*
 * ABROAD.UI.Places.SmallArea.Pulldown
 */
if( typeof( Beauty.UI.Places.SmallArea ) != 'function' ) {
    Beauty.UI.Places.SmallArea = function (){};
}
Beauty.UI.Places.SmallArea.Pulldown =
Class.create( Recruit.UI.Base.Pulldown.JSONP, {
    _get_def_props: function (){
        return {
            id          : 'bty-small-area-sel',
            name        : 'small_area',
            label       : '小エリア',
            has_parent  : true,
            parent      : 'middle_area',
            middle_area : ''
        };
    },
    _get_driver: function (){
        return new Recruit.UI.Driver.JSONP({
            url : '/beauty/small_area/v1/'
        });
    },
    _get_selections_material: function (){
        return this.driver.results.small_area;
    }
});

/*
 * Beauty.UI.HairImage.Pulldown - イメージプルダウン
 * VERSION 1.00
 * CHANGES
 *   2008-02-01 v1.00 released
 */
if( typeof( Beauty.UI.HairImage ) != 'function' ) {
    Beauty.UI.HairImage = function (){};
}
Beauty.UI.HairImage.Pulldown =
Class.create( Recruit.UI.Base.Pulldown.JSONP, {
    _get_def_props: function (){
        return {
            id          : 'bty-hair-image-sel',
            name        : 'hair_image',
            label       : 'イメージ'
        };
    },
    _get_driver: function (){
        return new Recruit.UI.Driver.JSONP({
            url : '/beauty/hair_image/v1/'
        });
    },
    _get_selections_material: function (){
        return this.driver.results.hair_image;
    }
});

/*
 * Beauty.UI.HairLength.Pulldown - 髪の長さプルダウン
 * VERSION 1.00
 * CHANGES
 *   2008-02-01 v1.00 released
 */
if( typeof( Beauty.UI.HairLength ) != 'function' ) {
    Beauty.UI.HairLength = function (){};
}
Beauty.UI.HairLength.Pulldown =
Class.create( Recruit.UI.Base.Pulldown.JSONP, {
    _get_def_props: function (){
        return {
            id          : 'bty-hair-length-sel',
            name        : 'hair_length',
            label       : '髪の長さ'
        };
    },
    _get_driver: function (){
        return new Recruit.UI.Driver.JSONP({
            url : '/beauty/hair_length/v1/'
        });
    },
    _get_selections_material: function (){
        return this.driver.results.hair_length;
    }
});

/*
 * Beauty.UI.HairRyou.Pulldown - 髪の量プルダウン
 * VERSION 1.00
 * CHANGES
 *   2008-01-22 v1.00 released
 */
if( typeof( Beauty.UI.HairRyou ) != 'function' ) {
    Beauty.UI.HairRyou = function (){};
}
Beauty.UI.HairRyou.Pulldown =
Class.create( Recruit.UI.Base.Pulldown, {
    _get_def_props: function (){
        return {
            id             : 'bty-hair-ryou-sel',
            name           : 'hair_ryou',
            label          : '髪の量'
        };
    },
    get_selections: function (){
        return {
            "1": "少ない",
            "2": "普通",
            "3": "多い"
        };
    }
});

/*
 * Beauty.UI.HairShitsu.Pulldown - 髪の質プルダウン
 * VERSION 1.00
 * CHANGES
 *   2008-01-22 v1.00 released
 */
if( typeof( Beauty.UI.HairShitsu ) != 'function' ) {
    Beauty.UI.HairShitsu = function (){};
}
Beauty.UI.HairShitsu.Pulldown =
Class.create( Recruit.UI.Base.Pulldown, {
    _get_def_props: function (){
        return {
            id             : 'bty-hair-shitsu-sel',
            name           : 'hair_shitsu',
            label          : '髪の質'
        };
    },
    get_selections: function (){
        return {
            "1": "柔かい",
            "2": "普通",
            "3": "硬い"
        };
    }
});

/*
 * Beauty.UI.HairFutosa.Pulldown - 髪の太さプルダウン
 * VERSION 1.00
 * CHANGES
 *   2008-01-22 v1.00 released
 */
if( typeof( Beauty.UI.HairFutosa ) != 'function' ) {
    Beauty.UI.HairFutosa = function (){};
}
Beauty.UI.HairFutosa.Pulldown =
Class.create( Recruit.UI.Base.Pulldown, {
    _get_def_props: function (){
        return {
            id             : 'bty-hair-futosa-sel',
            name           : 'hair_futosa',
            label          : '髪の太さ'
        };
    },
    get_selections: function (){
        return {
            "1": "細い",
            "2": "普通",
            "3": "太い"
        };
    }
});

/*
 * Beauty.UI.HairKuse.Pulldown - 髪のクセプルダウン
 * VERSION 1.00
 * CHANGES
 *   2008-01-22 v1.00 released
 */
if( typeof( Beauty.UI.HairKuse ) != 'function' ) {
    Beauty.UI.HairKuse = function (){};
}
Beauty.UI.HairKuse.Pulldown =
Class.create( Recruit.UI.Base.Pulldown, {
    _get_def_props: function (){
        return {
            id             : 'bty-hair-kuse-sel',
            name           : 'hair_kuse',
            label          : '髪のクセ'
        };
    },
    get_selections: function (){
        return {
            "1": "なし",
            "2": "少し",
            "3": "強い"
        };
    }
});

/*
 * Beauty.UI.HairKaogata.Pulldown - 顔型プルダウン
 * VERSION 1.00
 * CHANGES
 *   2008-01-22 v1.00 released
 */
if( typeof( Beauty.UI.HairKaogata ) != 'function' ) {
    Beauty.UI.HairKaogata = function (){};
}
Beauty.UI.HairKaogata.Pulldown =
Class.create( Recruit.UI.Base.Pulldown, {
    _get_def_props: function (){
        return {
            id             : 'bty-hair-kaogata-sel',
            name           : 'hair_kaogata',
            label          : '顔型'
        };
    },
    get_selections: function (){
        return {
            "1": "丸型",
            "2": "卵型",
            "3": "四角",
            "4": "逆三角",
            "5": "ベース"
        };
    }
});

/*
 * Beauty.UI.Order.Pulldown - 並び順プルダウン
 * VERSION 1.00
 * CHANGES
 *   2008-02-03 v1.00 released
 */
if( typeof( Beauty.UI.Order ) != 'function' ) {
    Beauty.UI.Order = function (){};
}
Beauty.UI.Order.Pulldown =
Class.create( Recruit.UI.Base.Pulldown, {
    _get_def_props: function (){
        return {
            id             : 'bty-order-sel',
            name           : 'order',
            label          : '並び順',
            first_opt_text : 'ランダム'
        };
    },
    get_selections: function (){
        return {
            "1": "サロン名かな順",
            "2": "小エリアコード順"
        };
    }
});

/*
 * Beauty.UI.Kodawari.Pulldown - こだわりプルダウン
 * VERSION 1.00
 * CHANGES
 *   2008-02-02 v1.00 released
 */
var Kodawari_skeleton = {
    _get_def_props: function (){
        return {
            id    : 'bty-kodawari-sel',
            name  : 'kodawari',
            label : 'こだわり'
        };
    },
    _get_driver: function (){
        return new Recruit.UI.Driver.JSONP({
            url : '/beauty/kodawari/v1/'
        });
    },
    _get_selections_material: function (){
        return this.driver.results.kodawari;
    }
};
if( typeof( Beauty.UI.Kodawari ) != 'function' ) {
    Beauty.UI.Kodawari = function (){};
}
Beauty.UI.Kodawari.Pulldown =
Class.create( Recruit.UI.Base.Pulldown.JSONP, Kodawari_skeleton );

/*
 * Beauty.UI.Kodawari.Checkbox - こだわりチェックボックス
 * VERSION 1.00
 * CHANGES
 *   2008-02-22 v1.00 released
 */
Beauty.UI.Kodawari.Checkbox =
Class.create( Recruit.UI.Base.Checkbox.JSONP,
    $.extend( Kodawari_skeleton, {
        _get_def_props: function (){
            return {
                id       : 'bty-kodawari-checkbox',
                name     : 'kodawari',
                label    : 'こだわり',
                template : 'horizontal'
            };
        }
    })
);

/*
 * Beauty.UI.KodawariSetsubi.Pulldown - こだわり設備プルダウン
 * VERSION 1.00
 * CHANGES
 *   2008-02-02 v1.00 released
 */
if( typeof( Beauty.UI.KodawariSetsubi ) != 'function' ) {
    Beauty.UI.KodawariSetsubi = function (){};
}
var KodawariSetsubi_skeleton = {
    _get_def_props: function (){
        return {
            id    : 'bty-kodawari-setsubi-sel',
            name  : 'kodawari_setsubi',
            label : 'こだわり設備'
        };
    },
    _get_driver: function (){
        return new Recruit.UI.Driver.JSONP({
            url : '/beauty/kodawari_setsubi/v1/'
        });
    },
    _get_selections_material: function (){
        return this.driver.results.kodawari_setsubi;
    }
};
Beauty.UI.KodawariSetsubi.Pulldown =
Class.create( Recruit.UI.Base.Pulldown.JSONP, KodawariSetsubi_skeleton );

/*
 * Beauty.UI.KodawariSetsubi.Checkbox - こだわり設備チェックボックス
 * VERSION 1.00
 * CHANGES
 *   2008-02-25 v1.00 released
 */
Beauty.UI.KodawariSetsubi.Checkbox =
Class.create( Recruit.UI.Base.Checkbox.JSONP,
    $.extend( KodawariSetsubi_skeleton, {
        _get_def_props: function (){
            return {
                id       : 'bty-kodawari-setsubi-checkbox',
                name     : 'kodawari_setsubi',
                label    : 'こだわり設備',
                template : 'horizontal'
            };
        }
    })
);

/*
 * Beauty.UI.KodawariMenu.Pulldown - こだわりメニュープルダウン
 * VERSION 1.00
 * CHANGES
 *   2008-02-02 v1.00 released
 */
if( typeof( Beauty.UI.KodawariMenu ) != 'function' ) {
    Beauty.UI.KodawariMenu = function (){};
}
var KodawariMenu_skeleton = {
    _get_def_props: function (){
        return {
            id          : 'bty-kodawari-menu-sel',
            name        : 'kodawari_menu',
            label       : 'こだわりメニュー'
        };
    },
    _get_driver: function (){
        return new Recruit.UI.Driver.JSONP({
            url : '/beauty/kodawari_menu/v1/'
        });
    },
    _get_selections_material: function (){
        return this.driver.results.kodawari_menu;
    }
};
Beauty.UI.KodawariMenu.Pulldown =
Class.create( Recruit.UI.Base.Pulldown.JSONP, KodawariMenu_skeleton );

/*
 * Beauty.UI.KodawariMenu.Checkbox - こだわりメニューチェックボックス
 * VERSION 1.00
 * CHANGES
 *   2008-02-25 v1.00 released
 */
Beauty.UI.KodawariMenu.Checkbox =
Class.create( Recruit.UI.Base.Checkbox.JSONP,
    $.extend( KodawariMenu_skeleton, {
        _get_def_props: function (){
            return {
                id       : 'bty-kodawari-menu-checkbox',
                name     : 'kodawari_menu',
                label    : 'こだわりメニュー',
                template : 'horizontal'
            };
        }
    })
);

/*
 * Beauty.UI.Male.Pulldown - 性別プルダウン
 * - for use with Style Search API
 * VERSION 1.00
 * CHANGES
 *   2008-02-11 v1.00 released
 */
if( typeof( Beauty.UI.Male ) != 'function' ) {
    Beauty.UI.Male = function (){};
}
Beauty.UI.Male.Pulldown =
Class.create( Recruit.UI.Base.Pulldown, {
    _get_def_props: function (){
        return {
            id             : 'bty-male-sel',
            name           : 'male',
            label          : '性別'
        };
    },
    get_selections: function (){
        return {
            "0": "女性のみ",
            "1": "男性のみ"
        };
    }
});

// end of jQuery no-conflict wrapper
})(jQuery);
