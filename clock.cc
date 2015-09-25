#include <stdlib.h>
#include <unistd.h>
#include <stdio.h>
#include <signal.h>
#include <time.h>
#include <node.h>
#include <v8.h>

#include "mraa.h"

#define PIN_PWM     3
#define PIN_GPIO    4
#define RATE_US     10730

using namespace v8;

timer_t timerid;
unsigned int counter = 0;

mraa_pwm_context pwm;
mraa_gpio_context gpio;

void board_setup() {
  pwm = mraa_pwm_init(PIN_PWM);
  if (pwm == NULL) {
    fprintf(stderr, "Could not initialize PWM.");
    return;
  }
  mraa_pwm_period_us(pwm, RATE_US);
  mraa_pwm_enable(pwm, 1);
  mraa_pwm_write(pwm, 0.5f);

  gpio = mraa_gpio_init(PIN_GPIO);
  if (gpio == NULL) {
    fprintf(stderr, "Could not initialize GPIO.");
    return;
  }
  mraa_gpio_dir(gpio, MRAA_GPIO_IN);
}

void timer_handler(void * ptr) {
    counter += 1;
}

Handle<Value> get_time(const Arguments& args) {
  HandleScope scope;
  return scope.Close(Uint32::New(counter));
}

void init(Handle<Object> exports) {
    board_setup();
    mraa_gpio_isr(gpio, MRAA_GPIO_EDGE_FALLING, timer_handler, NULL);
    exports->Set(String::NewSymbol("getTime"),
      FunctionTemplate::New(get_time)->GetFunction());
}

NODE_MODULE(clock, init)
