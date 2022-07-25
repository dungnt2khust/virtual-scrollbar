import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-virtual-scrollbar',
  templateUrl: './virtual-scrollbar.component.html',
  styleUrls: ['./virtual-scrollbar.component.scss'],
})
export class VirtualScrollbarComponent implements OnInit {
  @ViewChild('wrapper', { read: ElementRef }) wrapper: ElementRef;
  @ViewChild('track', { read: ElementRef }) track: ElementRef;
  @Input() horizontal = false;
  @Input() id = '';
  constructor() {}
  positionScroll = 0;
  movingTrack = false;
  startX = 0;
  startY = 0;
  trackTop = 0;
  trackLeft = 0;
  clientSize = 0;
  scrollSize = 0;

  thumbSize = 0;
  trackSize = 0;
  elementScrollable: any;
  haveScroll = false;

  ngAfterViewInit() {
    this.setSizeScrollbar();
    this.haveScroll = this.checkHaveScroll();
    this.elementScrollable = document.getElementById(this.id);
    this.elementScrollable.addEventListener('scroll', (e) => {
      if (!this.horizontal) {
        let scrollTop = this.elementScrollable.scrollTop;
        this.trackTop = (scrollTop / this.scrollSize) * this.thumbSize;
      } else {
        let scrollLeft = this.elementScrollable.scrollLeft;
        this.trackLeft = (scrollLeft / this.scrollSize) * this.thumbSize;
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (this.movingTrack) {
        this.clearSelection();
        var outWrapper = this.outWrapper(e);
        if (!outWrapper.out) {
          if (this.horizontal) {
            this.trackLeft = e.clientX - this.startX;
          } else {
            this.trackTop = e.clientY - this.startY;
          }
        } else {
          if (!this.horizontal) {
            if (e.clientY < this.thumbSize - this.trackSize) {
              this.trackTop = 0;
            } else {
              this.trackTop = this.thumbSize - this.trackSize;
            }
          } else {
            if (e.clientX < this.thumbSize - this.trackSize) {
              this.trackLeft = 0;
            } else {
              this.trackLeft = this.thumbSize - this.trackSize;
            }
          }
        }
        if (this.horizontal) {
          this.elementScrollable.scrollLeft =
            (this.trackLeft / this.thumbSize) * this.scrollSize;
        } else {
          this.elementScrollable.scrollTop =
            (this.trackTop / this.thumbSize) * this.scrollSize;
        }
      }
    });
    window.addEventListener('mouseup', (e) => {
      if (this.movingTrack) {
        this.movingTrack = false;
      }
    });
    window.addEventListener('resize', () => {
      this.setSizeScrollbar();
      this.haveScroll = this.checkHaveScroll();
    });
  }

  ngOnInit() {}
  /**
   * Kiểm tra xem có scroll không
   * createdby ntdung5 25.07.2022
   */
  checkHaveScroll() {
    if (this.elementScrollable) {
      let scrollWidth = this.elementScrollable.scrollWidth;
      let width = this.elementScrollable.getBoundingClientRect().width;
      console.log(scrollWidth, width);
      return scrollWidth > width;
    } else return false;
  }

  /**
   * Đặt kicks thước cho scrollbar
   * createdby ntdung5 25.07.2022
   */
  setSizeScrollbar() {
    var scrollable = document.getElementById(this.id);
    if (this.horizontal) {
      this.clientSize = scrollable.clientWidth;
      this.scrollSize = scrollable.scrollWidth;
      this.thumbSize = this.wrapper.nativeElement.getBoundingClientRect().width;
    } else {
      this.clientSize = scrollable.clientHeight;
      this.scrollSize = scrollable.scrollHeight;
      this.thumbSize =
        this.wrapper.nativeElement.getBoundingClientRect().height;
    }
    this.trackSize = (this.clientSize / this.scrollSize) * this.thumbSize;
  }

  mousedownMain(e) {
    console.log(e);
  }

  mousedownTrack(e) {
    this.movingTrack = true;
    this.startY =
      e.clientY - parseInt(getComputedStyle(this.track.nativeElement).top);
    this.startX =
      e.clientX - parseInt(getComputedStyle(this.track.nativeElement).left);
  }

  get styleScrollbar() {
    if (this.horizontal) {
      return {
        height: '18px',
        width: '100%',
      };
    } else {
      return {
        width: '18px',
        height: '100%',
      };
    }
  }

  /**
   * Xóa vùng đang chọn
   * createdby ntdung5 13.06.2022
   */
  clearSelection() {
    if (window.getSelection()) {
      if (window.getSelection().empty) {
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) {
        window.getSelection().removeAllRanges();
      }
    }
    // else if (document.selection) {
    //   document.selection.empty();
    // }
  }
  outWrapper(e) {
    let offset = this.horizontal
      ? e.clientX - this.startX
      : e.clientY - this.startY;
    if (offset >= 0 && offset <= this.thumbSize - this.trackSize) {
      return {
        out: false,
      };
    }
    return {
      out: true,
    };
  }
}
